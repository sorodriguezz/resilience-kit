import { Injectable } from '@nestjs/common';
import { RetryOptions } from '../../resilience.interfaces';

@Injectable()
export class RetryService {
  constructor(private readonly options: RetryOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const max = this.options.maxRetries ?? 3;
    const delayMs = this.options.delayMs ?? 1000;

    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt >= max) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
}