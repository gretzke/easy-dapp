import { Component, OnInit } from '@angular/core';
import { EthereumService } from 'src/app/services/ethereum.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public num = 0;

  constructor(private ethereum: EthereumService) {}

  ngOnInit(): void {}

  public async getNum(): Promise<void> {
    if (this.ethereum.contract === null) return;
    const result = await this.ethereum.contract.get('num');
    this.num = result.toNumber();
  }

  public async setNum(): Promise<void> {
    if (this.ethereum.contract === null) return;
    await this.ethereum.contract.set('setNum', [5]);
  }
}
