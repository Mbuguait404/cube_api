"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsBridgeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cms_bridge_service_1 = require("./cms-bridge.service");
const cms_bridge_controller_1 = require("./cms-bridge.controller");
const user_schema_1 = require("../../users/schemas/user.schema");
const auth_module_1 = require("../../auth/auth.module");
let CmsBridgeModule = class CmsBridgeModule {
};
exports.CmsBridgeModule = CmsBridgeModule;
exports.CmsBridgeModule = CmsBridgeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        providers: [cms_bridge_service_1.CmsBridgeService],
        controllers: [cms_bridge_controller_1.CmsBridgeController],
        exports: [cms_bridge_service_1.CmsBridgeService],
    })
], CmsBridgeModule);
//# sourceMappingURL=cms-bridge.module.js.map