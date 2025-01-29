import { Injectable } from '@nestjs/common';
import { TimeoutOptions } from '../../resilience.interfaces';

@Injectable()
export class TimeoutService {
  constructor(private readonly options: TimeoutOptions) {}

  getTimeoutMs(): number {
    return this.options.timeoutMs ?? 3000;
  }
}