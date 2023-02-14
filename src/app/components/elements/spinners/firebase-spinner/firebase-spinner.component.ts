import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firebase-spinner',
  templateUrl: './firebase-spinner.component.html',
  styleUrls: ['./firebase-spinner.component.scss'],
})
export class FirebaseSpinnerComponent implements OnInit {
  firebaseVisible = false;
  constructor() {
    setTimeout(() => {
      this.firebaseVisible = true;
    }, 2000);
  }

  ngOnInit(): void {}
}
