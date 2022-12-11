import { Component, OnInit } from '@angular/core';
import { faCodeFork, faFloppyDisk, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { saveDapp, setDescription, setEdit, setName, setUrl } from '../store/contract.actions';
import { configSelector, deploymentTypeSelector, editSelector, urlSelector } from '../store/contract.selector';

@Component({
  selector: 'app-contract-header',
  templateUrl: './contract-header.component.html',
  styleUrls: ['./contract-header.component.scss'],
})
export class ContractHeaderComponent implements OnInit {
  public faFloppyDisk = faFloppyDisk;
  public faPenToSquare = faPenToSquare;
  public faCodeFork = faCodeFork;
  public edit$ = this.store.select(editSelector);
  public deploymentType$ = this.store.select(deploymentTypeSelector);
  public config$ = this.store.select(configSelector);
  public url$ = this.store.select(urlSelector);

  constructor(private store: Store<{}>) {}

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
}
