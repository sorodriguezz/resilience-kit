import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FallbackInterceptor } from './fallback.interceptor';

export function UseFallback() {
  return applyDecorators(UseInterceptors(FallbackInterceptor));
}