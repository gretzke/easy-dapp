import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Observable, Subscription, take } from 'rxjs';
import { EthereumService } from 'src/app/services/ethereum.service';
import { abiError, abiResponse, getAbi, notify } from 'src/app/store/app.actions';
import { chainIdSelector, userChainIdSelector } from 'src/app/store/app.selector';
import { IDapp } from 'src/types/abi';
import { setContract } from '../contract-interaction/store/contract.actions';
import { contractSelector } from '../contract-interaction/store/contract.selector';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss'],
})
export class AddContractComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public fetchingEtherscan?: boolean = undefined;
  public etherscanError = '';
  private subscription = new Subscription();
  public contract$: Observable<IDapp | undefined>;

  constructor(private ethereum: EthereumService, private store: Store<{}>, private actions: Actions, private route: ActivatedRoute) {
    this.form = new FormGroup({
      address: new FormControl('', [Validators.required], [this.addressValidator()]),
      abi: new FormControl('', [Validators.required], [this.jsonValidator()]),
    });

    this.contract$ = this.store.select(contractSelector);
    this.store.dispatch(setContract({ src: AddContractComponent.name, contract: undefined }));
    this.subscription.add(
      this.form.controls.address.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
        this.fetchAbi(value);
      })
    );

    this.subscription.add(
      this.actions.pipe(ofType(abiResponse)).subscribe((action) => {
        this.form.controls.abi.setValue(action.abi);
        this.fetchingEtherscan = false;
        this.form.controls.abi.disable();
        if (action.verified) {
          this.store.dispatch(
            notify({ src: AddContractComponent.name, message: 'Contract verified on Etherscan!', notificationType: 'success' })
          );
          this.addContract();
        }
      })
    );
    this.subscription.add(
      this.actions.pipe(ofType(abiError)).subscribe((action) => {
        this.fetchingEtherscan = false;
        if (action.message === 'ETHERSCAN_VERIFICATION_ERROR' && action.details === 'CONTRACT_NOT_VERIFIED') {
          this.etherscanError = 'Contract not verified on Etherscan, please enter below';
        } else {
          console.error(action.message, action.details);
          this.etherscanError = 'Could not fetch ABI from Etherscan, please enter below';
        }
      })
    );

    this.subscription.add(
      this.store.select(chainIdSelector).subscribe((chainId) => {
        if (chainId && this.route.snapshot.params.address) {
          this.form.controls.address.setValue(this.route.snapshot.params.address);
        } else {
          this.fetchAbi(this.form.controls.address.value);
        }
      })
    );
  }

  ngOnInit(): void {}

  private fetchAbi(value: string) {
    this.form.controls.abi.enable();
    if (this.ethereum.isAddress(value)) {
      this.fetchingEtherscan = true;
      this.etherscanError = '';
      this.store.dispatch(getAbi({ src: AddContractComponent.name, address: value }));
    } else {
      this.fetchingEtherscan = undefined;
      this.etherscanError = '';
    }
  }

  private addressValidator(): AsyncValidatorFn {
    return async (c: AbstractControl): Promise<ValidationErrors | null> => {
      if (!this.ethereum.isAddress(c.value)) {
        return { address: true };
      }
      return null;
    };
  }

  private jsonValidator(): AsyncValidatorFn {
    return async (c: AbstractControl): Promise<ValidationErrors | null> => {
      try {
        JSON.parse(c.value);
      } catch (e) {
        return { json: true };
      }
      return null;
    };
  }

  public addContract() {
    this.store
      .select(userChainIdSelector)
      .pipe(take(1))
      .subscribe((data) => {
        this.store.dispatch(
          setContract({
            src: AddContractComponent.name,
            contract: {
              chainId: data.chainId,
              address: this.form.controls.address.value,
              abi: this.form.controls.abi.value,
              config: {
                name: '',
                description: '',
                functionConfig: {},
                read: {
                  order: [],
                },
                write: {
                  order: [],
                },
              },
              owner: data.user!,
              url: '',
            },
            firstDeployment: true,
          })
        );
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
