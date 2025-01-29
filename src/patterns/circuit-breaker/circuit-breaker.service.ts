import CircuitBreaker from "opossum";
import { Injectable, Logger } from "@nestjs/common";
import { CircuitBreakerOptions } from "../../resilience.interfaces";

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly breaker: any;

  constructor(private readonly options: CircuitBreakerOptions) {
    this.breaker = new CircuitBreaker(this.asyncAction, {
      timeout: options.timeout ?? 3000,
      errorThresholdPercentage: options.errorThresholdPercentage ?? 50,
      resetTimeout: options.resetTimeout ?? 10000,
    });

    this.breaker.on("open", () => this.logger.log("Circuit opened"));
    this.breaker.on("halfOpen", () => this.logger.log("Circuit half-open"));
    this.breaker.on("close", () => this.logger.log("Circuit closed"));
  }

  private async asyncAction(payload: any) {
    return payload;
  }

  async fire(payload: any): Promise<any> {
    return this.breaker.fire(payload);
  }
}
