var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { DatabaseModule } from './database/database.module.js';
import { DiscoveryModule } from './discovery/discovery.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { CopilotModule } from './copilot/copilot.module.js';
import { BedModule } from './hospital/bed.module.js';
import { PharmacyModule } from './pharmacy/pharmacy.module.js';
import { LaboratoryModule } from './laboratory/laboratory.module.js';
import { OrchestratorModule } from './orchestrator/orchestrator.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { IncidentModule } from './incident/incident.module.js';
import { SystemHealthCheck } from './health/system.health.js';
/**
 * Arogya Appointment Arc — root application module.
 *
 * Patient journey exposed over MCP:
 *   search-doctors → compare-slots → book-appointment → get-appointment
 *
 * `DatabaseModule` owns the single Mongoose connection to the `health`
 * database and seeds the demo provider directory on boot.
 */
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
        server: {
            name: 'arogya-appointment-arc',
            version: '1.0.0',
        },
        logging: {
            level: 'info',
        },
    }),
    Module({
        name: 'app',
        description: 'Arogya Appointment Arc — doctor discovery and appointment booking',
        imports: [
            ConfigModule.forRoot(),
            DatabaseModule,
            DiscoveryModule,
            AppointmentsModule,
            CopilotModule,
            BedModule,
            PharmacyModule,
            LaboratoryModule,
            OrchestratorModule,
            AnalyticsModule,
            IncidentModule,
        ],
        providers: [
            // Health Checks
            SystemHealthCheck,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map