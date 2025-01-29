import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TimeoutInterceptor } from './timeout.interceptor';

export function UseTimeout() {
  return applyDecorators(UseInterceptors(TimeoutInterceptor));
}