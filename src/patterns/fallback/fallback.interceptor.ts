import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from "@nestjs/common";
import { Observable, catchError, of } from "rxjs";
import { RESILIENCE_OPTIONS } from "../../resilience.constants";
import {
  ResilienceModuleOptions,
  FallbackOptions,
} from "../../resilience.interfaces";
import { FallbackService } from "./fallback.service";

@Injectable()
export class FallbackInterceptor implements NestInterceptor {
  private readonly fallbackService: FallbackService | null = null;
  private readonly enabled: boolean;

  constructor(
    @Inject(RESILIENCE_OPTIONS) private readonly config: ResilienceModuleOptions
  ) {
    const options: FallbackOptions = config.fallback || {};
    this.enabled = !!options.enabled;

    if (this.enabled) {
      this.fallbackService = new FallbackService(options);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.enabled || !this.fallbackService) {
      return next.handle();
    }

    return next.handle().pipe(
      catchError((error) => {
        const fallbackValue = this.fallbackService!.executeFallback();
        return of(fallbackValue);
      })
    );
  }
}
