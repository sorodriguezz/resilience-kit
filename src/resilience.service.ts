import { Injectable, Inject } from "@nestjs/common";
import { RESILIENCE_OPTIONS } from "./resilience.constants";
import { ResilienceModuleOptions } from "./resilience.interfaces";

@Injectable()
export class ResilienceService {

  constructor(
    @Inject(RESILIENCE_OPTIONS)
    private readonly options: ResilienceModuleOptions,
  ) {}

  getCircuitBreakerOptions() {
    return this.options.circuitBreaker || {};
  }

  getRetryOptions() {
    return this.options.retry || {};
  }

  getTimeoutOptions() {
    return this.options.timeout || {};
  }

  getFallbackOptions() {
    return this.options.fallback || {};
  }
}
