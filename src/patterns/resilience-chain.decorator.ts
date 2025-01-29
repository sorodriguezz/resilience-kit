import {
  applyDecorators,
  NestInterceptor,
  Type,
  UseInterceptors,
} from "@nestjs/common";
import { CircuitBreakerInterceptor } from "./circuit-breaker/circuit-breaker.interceptor";
import { RetryInterceptor } from "./retry/retry.interceptor";
import { ResilienceChainOptions } from "../resilience.interfaces";
import { TimeoutInterceptor } from "./timeout/timeout.interceptor";
import { FallbackInterceptor } from "./fallback/fallback.interceptor";

export function UseResilienceChain(
  options: ResilienceChainOptions = {
    circuitBreaker: true,
    retry: true,
    timeout: true,
    fallback: true,
  },
) {
  const interceptors: Type<NestInterceptor>[] = [];

  if (options.timeout) {
    interceptors.push(TimeoutInterceptor);
  }
  if (options.retry) {
    interceptors.push(RetryInterceptor);
  }
  if (options.circuitBreaker) {
    interceptors.push(CircuitBreakerInterceptor);
  }
  if (options.fallback) {
    interceptors.push(FallbackInterceptor);
  }

  return applyDecorators(UseInterceptors(...interceptors));
}
