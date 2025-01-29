import { Inject, Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { RESILIENCE_OPTIONS } from "./resilience.constants";
import { ResilienceModuleOptions } from "./resilience.interfaces";

@Injectable()
export class ResilienceLoggerService implements OnModuleInit {
  private readonly logger = new Logger(ResilienceLoggerService.name);

  constructor(
    @Inject(RESILIENCE_OPTIONS)
    private readonly options: ResilienceModuleOptions
  ) {}

  onModuleInit() {
    if (!this.options.logOnStartup) {
      return;
    }

    if (!this.options) {
      this.logger.warn("No resilience config provided");
      return;
    }
    const configString = JSON.stringify(this.options, null, 2);
    this.logger.log(`Resilience configuration:\n${configString}`);
  }
}
