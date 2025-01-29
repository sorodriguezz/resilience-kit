import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { RetryInterceptor } from './retry.interceptor';

export function UseRetry() {
  return applyDecorators(UseInterceptors(RetryInterceptor));
}