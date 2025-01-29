import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from "@nestjs/common";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  ResilienceModuleOptions,
  CircuitBreakerOptions,
} from "../../resilience.interfaces";
import { RESILIENCE_OPTIONS } from "../../resilience.constants";
import { CircuitBreakerService } from "./circuit-breaker.service";

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly circuitBreakerService: CircuitBreakerService | null = null;
  private readonly enabled: boolean;

  constructor(
    @Inject(RESILIENCE_OPTIONS) private readonly config: ResilienceModuleOptions
  ) {
    const options: CircuitBreakerOptions = config.circuitBreaker || {};
    this.enabled = !!options.enabled;

    if (this.enabled) {
      this.circuitBreakerService = new CircuitBreakerService(options);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.enabled || !this.circuitBreakerService) {
      return next.handle();
    }

    return from(
      this.circuitBreakerService.fire({
        body: context.switchToHttp().getRequest().body,
      })
    ).pipe(switchMap(() => next.handle()));
  }
}
