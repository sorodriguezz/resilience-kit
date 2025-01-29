import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from "@nestjs/common";
import { Observable, from, lastValueFrom } from "rxjs";
import {
  ResilienceModuleOptions,
  RetryOptions,
} from "../../resilience.interfaces";
import { RESILIENCE_OPTIONS } from "../../resilience.constants";
import { RetryService } from "./retry.service";

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly retryService: RetryService | null = null;
  private readonly enabled: boolean;

  constructor(
    @Inject(RESILIENCE_OPTIONS) private readonly config: ResilienceModuleOptions
  ) {
    const options: RetryOptions = config.retry || {};
    this.enabled = !!options.enabled;

    if (this.enabled) {
      this.retryService = new RetryService(options);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.enabled || !this.retryService) {
      return next.handle();
    }

    const attemptFn = async () => {
      return await lastValueFrom(next.handle());
    };

    return from(this.retryService.execute(() => attemptFn()));
  }
}
