import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-enum-config',
  templateUrl: './enum-config.component.html',
  styleUrls: ['./enum-config.component.scss'],
})
export class EnumConfigComponent implements OnInit {
  @Input() enums: string[] = [];

  constructor() {}

  ngOnInit(): void {}
}
