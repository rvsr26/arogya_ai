import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { DatabaseModule } from './database/database.module.js';
import { DiscoveryModule } from './discovery/discovery.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
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
@McpApp({
  module: AppModule,
  server: {
    name: 'arogya-appointment-arc',
    version: '1.0.0',
  },
  logging: {
    level: 'info',
  },
})
@Module({
  name: 'app',
  description: 'Arogya Appointment Arc — doctor discovery and appointment booking',
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    DiscoveryModule,
    AppointmentsModule,
  ],
  providers: [
    // Health Checks
    SystemHealthCheck,
  ],
})
export class AppModule {}
