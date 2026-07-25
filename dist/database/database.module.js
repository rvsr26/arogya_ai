var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { DatabaseService } from './database.service.js';
/**
 * Shared MongoDB access layer. Exports `DatabaseService` so feature modules
 * (discovery, appointments) can inject it without owning a connection.
 */
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    Module({
        name: 'database',
        description: 'MongoDB (health) connection, schemas and demo seeding',
        providers: [DatabaseService],
        exports: [DatabaseService],
    })
], DatabaseModule);
export { DatabaseModule };
//# sourceMappingURL=database.module.js.map