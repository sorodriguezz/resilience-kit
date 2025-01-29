import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { timeout, catchError } from "rxjs/operators";
import { RESILIENCE_OPTIONS } from "../../resilience.constants";
import {
  ResilienceModuleOptions,
  TimeoutOptions,
} from "../../resilience.interfaces";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs: number;
  private readonly enabled: boolean;

  constructor(
    @Inject(RESILIENCE_OPTIONS) private readonly config: ResilienceModuleOptions
  ) {
    const options: TimeoutOptions = config.timeout || {};
    this.enabled = !!options.enabled;
    this.timeoutMs = options.timeoutMs ?? 3000;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.enabled) {
      return next.handle();
    }

    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new Error("Request Timeout"));
        }
        return throwError(() => err);
      })
    );
  }
}
