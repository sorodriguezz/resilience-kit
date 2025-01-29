<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href='https://img.shields.io/npm/l/resilience-kit'><img src="https://img.shields.io/npm/l/resilience-kit" alt="MIT License" /></a>
</p>

**Resilience Kit** proporciona **patrones de resiliencia** como Circuit Breaker, Retry, Timeout y Fallback para **NestJS** (y Node.js). Permite configurar y aplicar estos patrones de forma sencilla mediante **interceptores**, **decoradores** y un **módulo dinámico**.

## 🚀 Características principales

✅ **Circuit Breaker**: Protege tu aplicación de fallos repetitivos o servicios inestables.  
✅ **Retry**: Reintenta automáticamente una operación fallida.  
✅ **Timeout**: Detiene las operaciones que toman demasiado tiempo.  
✅ **Fallback**: Devuelve una respuesta alternativa cuando una operación falla.  
✅ **Configuración dinámica**: Usa `ResilienceModule.forRoot()` o `forRootAsync()`.  
✅ **Decoradores e Interceptores**: Integración sencilla con NestJS (`@UseCircuitBreaker()`, `@UseRetry()`, etc.).  
✅ **Encadenamiento de patrones**: Aplica múltiples patrones en un solo endpoint.

---

## 📦 Instalación

```bash
npm install resilience-kit
```

O usando Yarn:

```bash
yarn add resilience-kit
```

### Requisitos

- NestJS (v9 o superior recomendado).
- Node.js 16+ (para soporte de ES2020).

---

## 📌 Uso básico en NestJS

### 1️⃣ Importar el módulo

En tu `AppModule` (o el módulo donde lo necesites), importa `ResilienceModule` y configura los patrones deseados:

```typescript
import { Module } from "@nestjs/common";
import { ResilienceModule } from "resilience-kit";

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
        fallbackMethod: () => ({ message: "Fallback result" }),
      },
    }),
  ],
})
export class AppModule {}
```

Si necesitas cargar la configuración de forma asíncrona, usa `forRootAsync()`:

```typescript
ResilienceModule.forRootAsync({
  useFactory: async () => ({
    circuitBreaker: { enabled: true, timeout: 2000 },
    retry: { enabled: true, maxRetries: 5 },
  }),
});
```

---

### 2️⃣ Aplicar decoradores en los endpoints

Puedes usar los decoradores que provee la librería en tus controladores de NestJS:

```typescript
import { Controller, Get } from "@nestjs/common";
import {
  UseCircuitBreaker,
  UseRetry,
  UseTimeout,
  UseFallback,
} from "resilience-kit";

@Controller("demo")
export class DemoController {
  @Get("retry")
  @UseRetry()
  getWithRetry() {
    throw new Error("Forzando error para reintento");
  }

  @Get("timeout")
  @UseTimeout()
  async getWithTimeout() {
    return new Promise((resolve) =>
      setTimeout(() => resolve("Respuesta tardía"), 5000)
    );
  }

  @Get("circuit")
  @UseCircuitBreaker()
  getWithCircuitBreaker() {
    if (Math.random() < 0.7) {
      throw new Error("Random Failure");
    }
    return "Success!";
  }

  @Get("fallback")
  @UseFallback()
  getWithFallback() {
    throw new Error("Forzamos error para usar fallbackMethod");
  }
}
```

> **Nota**: Cuando un patrón no está habilitado (`enabled: false`), el interceptor simplemente no hace nada.

---

## ⚙️ Configuración detallada

```typescript
interface ResilienceModuleOptions {
  circuitBreaker?: {
    enabled?: boolean;
    timeout?: number;
    errorThresholdPercentage?: number;
    resetTimeout?: number;
  };
  retry?: {
    enabled?: boolean;
    maxRetries?: number;
    delayMs?: number;
  };
  timeout?: {
    enabled?: boolean;
    timeoutMs?: number;
  };
  fallback?: {
    enabled?: boolean;
    fallbackMethod?: () => any;
  };
}
```

---

## 🔗 Uso en cadena

Puedes aplicar múltiples patrones, todos a la vez y simultáneamente con un solo decorador:

```typescript
@Get('all-patterns')
@UseResilienceChain() // Aplica Timeout, Retry, Circuit Breaker, Fallback, etc.
myEndpoint() {
  // Lógica del endpoint
}
```

O puedes habilitar los que desees usar de la siguiente manera:

```typescript
  @Get('timeout-retry')
  @UseResilienceChain({ timeout: true, retry: true }) // Solo aplica Retry y TimeOut
  getTimeoutAndRetry() {
    return this.testService.mightFailRandomly();
  }
```

---

## 📡 Logs

También puedes loggear la configuración inicial al arrancar la aplicación:

```typescript
  imports: [
    ResilienceModule.forRoot({
      logOnStartup: true, <- Para loguear apenas arranca
      circuitBreaker: {
        enabled: true,
        timeout: 2000,
        errorThresholdPercentage: 50,
        resetTimeout: 3000,
      },
    }),
  ],
```

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Puedes usarlo libremente en entornos personales y comerciales.
