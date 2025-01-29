export interface CircuitBreakerOptions {
  enabled?: boolean;
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
}

export interface RetryOptions {
  enabled?: boolean;
  maxRetries?: number;
  delayMs?: number;
}

export interface TimeoutOptions {
  enabled?: boolean;
  timeoutMs?: number;
}

export interface FallbackOptions {
  enabled?: boolean;
  fallbackMethod?: () => any;
}

export interface ResilienceModuleOptions {
  circuitBreaker?: CircuitBreakerOptions;
  retry?: RetryOptions;
  timeout?: TimeoutOptions;
  fallback?: FallbackOptions;
}
