import CircuitBreaker from "opossum";
import { Injectable } from "@nestjs/common";
import { CircuitBreakerOptions } from "../../resilience.interfaces";

@Injectable()
export class CircuitBreakerService {
  private readonly breaker: any;

  constructor(private readonly options: CircuitBreakerOptions) {
    this.breaker = new CircuitBreaker(this.fakeAction, {
      timeout: options.timeout || 3000,
      errorThresholdPercentage: options.errorThresholdPercentage || 50,
      resetTimeout: options.resetTimeout || 10000,
    });

    this.breaker.on("open", () => console.log("Circuit opened"));
    this.breaker.on("halfOpen", () => console.log("Circuit half-open"));
    this.breaker.on("close", () => console.log("Circuit closed"));
  }

  private async fakeAction(payload: any) {
    return payload;
  }

  async fire(payload: any): Promise<any> {
    return this.breaker.fire(payload);
  }
}
