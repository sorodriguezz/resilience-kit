import { Injectable } from "@nestjs/common";
import { FallbackOptions } from "../../resilience.interfaces";

@Injectable()
export class FallbackService {
  constructor(private readonly options: FallbackOptions) {}

  executeFallback() {
    if (this.options.fallbackMethod) {
      return this.options.fallbackMethod();
    }
    return { message: "Default fallback" };
  }

  async executeWithFallback<T>(fn: () => Promise<T>): Promise<T | any> {
    try {
      return await fn();
    } catch (error) {
      return this.executeFallback();
    }
  }
}
