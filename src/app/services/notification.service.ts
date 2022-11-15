import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService, private translate: TranslateService) {}

  public success(i18n_string: string) {
    this.toastr.success(this.translate.instant(i18n_string));
  }

  public error(i18n_string: string) {
    this.toastr.error(this.translate.instant(i18n_string));
  }

  public info(i18n_string: string) {
    this.toastr.info(this.translate.instant(i18n_string));
  }
}
