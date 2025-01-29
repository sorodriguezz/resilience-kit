# NestJS Resilience Lib

Una librería para **NestJS** que implementa patrones de **resiliencia** (Circuit Breaker, Retry, Timeout, Fallback, etc.) de forma sencilla y configurable.

## Características

- **Circuit Breaker**: Evita colapsos cuando un servicio externo falla repetidamente.
- **Retry**: Reintenta una operación en caso de error.
- **Timeout**: Cancela solicitudes que tarden demasiado tiempo en completarse.
- **Fallback**: Proporciona un resultado alternativo cuando una operación falla.
- **Configuración centralizada**: Gracias a un módulo dinámico y el uso de `RESILIENCE_OPTIONS`.
- **Decoradores e Interceptores**: Integración sencilla y “al estilo NestJS” mediante `@UseCircuitBreaker()`, `@UseRetry()`, `@UseTimeout()`, `@UseFallback()`.

## Instalación

```bash
npm install nestjs-resilience-lib
# o
yarn add nestjs-resilience-lib
```

## Uso básico

1.	Importa el ResilienceModule en tu AppModule (o donde necesites):
```typescript
import { Module } from '@nestjs/common';
import { ResilienceModule } from 'nestjs-resilience-lib';

@Module({
  imports: [
    ResilienceModule.forRoot({
      circuitBreaker: {
        enabled: true,
        timeout: 2000,
        errorThresholdPercentage: 50,
        resetTimeout: 10000,
      },
      retry: {
        enabled: true,
        maxRetries: 3,
        delayMs: 500,
      },
      timeout: {
        enabled: true,
        timeoutMs: 3000,
      },
      fallback: {
        enabled: true,
        fallbackMethod: () => ({ message: 'Fallback result' }),
      },
    }),
  ],
})
export class AppModule {}

```

Nota: También existe forRootAsync() para cargar la configuración de manera asíncrona (por ejemplo, desde un microservicio de configuración o variables de entorno).

2.	Usa los decoradores en tus controladores o métodos:

import { Controller, Get } from '@nestjs/common';
import {
  UseCircuitBreaker,
  UseRetry,
  UseTimeout,
  UseFallback,
} from 'nestjs-resilience-lib';

@Controller('test')
export class TestController {
  @Get('circuit')
  @UseCircuitBreaker()
  testCircuitBreaker() {
    // Lógica que podría fallar
    return { data: 'Circuit Breaker endpoint' };
  }

  @Get('retry')
  @UseRetry()
  testRetry() {
    // Se reintentará si falla
    return { data: 'Retry endpoint' };
  }

  @Get('timeout')
  @UseTimeout()
  testTimeout() {
    // Se cancela si demora más de 3s
    return new Promise((resolve) => setTimeout(() => resolve({ data: 'Timeout response' }), 5000));
  }

  @Get('fallback')
  @UseFallback()
  testFallback() {
    // Forzamos un error para probar fallback
    throw new Error('Simulated error');
  }
}


	3.	(Opcional) Usa el ResilienceService para acceder a la configuración o centralizar lógica:

import { Injectable } from '@nestjs/common';
import { ResilienceService } from 'nestjs-resilience-lib';

@Injectable()
export class SomeCustomService {
  constructor(private readonly resilienceService: ResilienceService) {}

  doSomething() {
    const circuitBreakerOpts = this.resilienceService.getCircuitBreakerOptions();
    console.log('CircuitBreaker Timeout:', circuitBreakerOpts.timeout);

    const retryOpts = this.resilienceService.getRetryOptions();
    console.log('Max Retries:', retryOpts.maxRetries);
    // ...
  }
}



Configuración

El objeto ResilienceModule.forRoot(...) recibe un ResilienceModuleOptions con las siguientes propiedades:
	•	circuitBreaker:
	•	enabled: booleano. Activa o desactiva el Circuit Breaker.
	•	timeout: tiempo máximo (ms) para la operación envuelta (p. ej. 2000 ms).
	•	errorThresholdPercentage: porcentaje de errores para abrir el circuito.
	•	resetTimeout: tiempo (ms) para “half-open” después de abrirse el circuito.
	•	retry:
	•	enabled: booleano. Activa o desactiva reintentos.
	•	maxRetries: número máximo de reintentos.
	•	delayMs: tiempo (ms) de espera entre reintentos.
	•	timeout:
	•	enabled: booleano. Activa o desactiva el timeout.
	•	timeoutMs: tiempo máximo (ms) que esperamos antes de cancelar.
	•	fallback:
	•	enabled: booleano. Activa o desactiva fallback.
	•	fallbackMethod: función que retorna un valor alternativo cuando hay error.

Ejemplo con forRootAsync

ResilienceModule.forRootAsync({
  useFactory: async () => {
    // Podrías obtener variables de entorno, llamar a un servicio, etc.
    return {
      circuitBreaker: { enabled: true, timeout: 1000 },
      retry: { enabled: true, maxRetries: 3, delayMs: 500 },
      timeout: { enabled: true, timeoutMs: 3000 },
      fallback: { enabled: true, fallbackMethod: () => 'Fallback data' },
    };
  },
  inject: [],
}),

Extensiones y próximos pasos
	•	Nuevos patrones: Puedes añadir Rate Limiting, Bulkhead, etc.
	•	Test unitarios: Recomendado usar Jest para verificar fallas, timeouts, y aperturas de circuitos.
	•	Observabilidad: Integra logs y métricas para monitorear cuántas veces se abre el circuito, cuántos reintentos ocurren, etc.

Contribuciones

¡Las PRs y sugerencias son bienvenidas! Por favor, abre un issue o PR en el repositorio oficial para discutir cualquier mejora.

Licencia

MIT

---

## Comentarios finales

- El **`ResilienceService`** es un servicio adicional para facilitar el acceso y la manipulación de la configuración en tu aplicación.
- No es obligatorio usarlo si prefieres inyectar directamente `RESILIENCE_OPTIONS` en cada interceptor o clase.
- El **README** anterior es solo un **ejemplo**; personalízalo según tus necesidades, tu repositorio y tus enlaces.

¡Con esto, deberías tener todo lo necesario para crear, documentar y publicar tu librería de resiliencia para NestJS!
```
