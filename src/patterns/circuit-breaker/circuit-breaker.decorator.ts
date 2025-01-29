import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CircuitBreakerInterceptor } from './circuit-breaker.interceptor';

export function UseCircuitBreaker() {
  return applyDecorators(UseInterceptors(CircuitBreakerInterceptor));
}