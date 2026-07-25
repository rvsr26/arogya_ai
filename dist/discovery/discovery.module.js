var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { DatabaseModule } from '../database/database.module.js';
import { DatabaseService } from '../database/database.service.js';
import { DiscoveryService } from './discovery.service.js';
import { DiscoveryTools } from './discovery.tools.js';
/**
 * Doctor discovery: directory search and side-by-side slot comparison.
 */
let DiscoveryModule = class DiscoveryModule {
};
DiscoveryModule = __decorate([
    Module({
        name: 'discovery',
        description: 'Search the doctor directory and compare open consultation slots',
        imports: [DatabaseModule],
        providers: [DatabaseService, DiscoveryService],
        controllers: [DiscoveryTools],
    })
], DiscoveryModule);
export { DiscoveryModule };
//# sourceMappingURL=discovery.module.js.map