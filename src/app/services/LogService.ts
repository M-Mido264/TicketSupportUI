import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr';

export enum LogLevel {
  Info = 1,
  Error,
  Warning,
  Success,
}

@Injectable()
export class LogService {
  constructor(private toaster: ToastrService) {}

  //type: success, info, warn, error
  pop(level: LogLevel, body: string) {
    switch (level) {
      case LogLevel.Info:
        this.toaster.info(body);
        break
      case LogLevel.Error:
        this.toaster.error(body);
        break
      case LogLevel.Warning:
        this.toaster.warning(body);

        break
      case LogLevel.Success:
        this.toaster.success(body);
        break
      default:
        this.toaster.info(body);
        break
    }
  }
}
