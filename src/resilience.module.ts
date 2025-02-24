import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ResilienceModuleOptions } from './resilience.interfaces';
import { RESILIENCE_OPTIONS } from './resilience.constants';
import { ResilienceLoggerService } from './resilience-logger.service';

@Module({})
export class ResilienceModule {
  static forRoot(options: ResilienceModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: RESILIENCE_OPTIONS,
        useValue: options,
      },
      ResilienceLoggerService,
    ];

    return {
      module: ResilienceModule,
      providers,
      exports: providers,
      global: true,
    };
  }

  static forRootAsync(asyncOptions: {
    useFactory: (...args: any[]) => Promise<ResilienceModuleOptions> | ResilienceModuleOptions;
    inject?: any[];
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: RESILIENCE_OPTIONS,
        useFactory: asyncOptions.useFactory,
        inject: asyncOptions.inject || [],
      },
      ResilienceLoggerService,
    ];

    return {
      module: ResilienceModule,
      providers,
      exports: providers,
      global: true,
    };
  }
}