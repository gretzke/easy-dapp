import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCodeFork, faFloppyDisk, faHeart as faHeartSolid, faLink, faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { localModeSelector } from 'src/app/services/dapps/store/dapps.selector';
import { deleteDapp, likeDapp, saveDapp, setDescription, setEdit, setName, setUrl } from '../store/contract.actions';
import { configSelector, deploymentTypeSelector, editSelector, likedContractSelector, urlSelector } from '../store/contract.selector';

@Component({
  selector: 'app-contract-header',
  templateUrl: './contract-header.component.html',
  styleUrls: ['./contract-header.component.scss'],
})
export class ContractHeaderComponent implements OnInit, OnDestroy {
  @Input() public blockExplorerUrl: string = '';
  public faFloppyDisk = faFloppyDisk;
  public faPenToSquare = faPenToSquare;
  public faCodeFork = faCodeFork;
  public faLink = faLink;
  public faTrash = faTrashAlt;
  public faHeart = faHeart;
  public faHeartSolid = faHeartSolid;
  public edit$ = this.store.select(editSelector);
  public deploymentType$ = this.store.select(deploymentTypeSelector);
  public config$ = this.store.select(configSelector);
  public url$ = this.store.select(urlSelector);
  public localMode$ = this.store.select(localModeSelector);
  public liked = false;
  private subscriptions = new Subscription();

  constructor(private store: Store<{}>) {
    this.store.select(likedContractSelector).subscribe((liked) => (this.liked = liked));
  }

  ngOnInit(): void {}

  setName(name: string) {
    this.store.dispatch(setName({ src: ContractHeaderComponent.name, name }));
  }

  setDescription(description: string) {
    this.store.dispatch(setDescription({ src: ContractHeaderComponent.name, description }));
  }

  async setUrl(url: string) {
    this.store.dispatch(setUrl({ src: ContractHeaderComponent.name, url }));
  }

  async saveDapp() {
    this.store.dispatch(saveDapp({ src: ContractHeaderComponent.name }));
  }

  public setEdit() {
    this.store.dispatch(setEdit({ src: ContractHeaderComponent.name, edit: true }));
  }

  deleteDapp() {
    this.store.dispatch(deleteDapp({ src: ContractHeaderComponent.name }));
  }

  toggleLike() {
    this.store.dispatch(likeDapp({ src: ContractHeaderComponent.name, liked: !this.liked }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
