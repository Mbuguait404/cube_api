"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const badges_service_1 = require("./badges.service");
const badge_schema_1 = require("./schemas/badge.schema");
let BadgesModule = class BadgesModule {
};
exports.BadgesModule = BadgesModule;
exports.BadgesModule = BadgesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: badge_schema_1.Badge.name, schema: badge_schema_1.BadgeSchema }]),
        ],
        providers: [badges_service_1.BadgesService],
        exports: [badges_service_1.BadgesService],
    })
], BadgesModule);
//# sourceMappingURL=badges.module.js.map