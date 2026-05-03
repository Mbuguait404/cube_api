"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeSchema = exports.Badge = exports.BadgeTrigger = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var BadgeTrigger;
(function (BadgeTrigger) {
    BadgeTrigger["MANUAL"] = "manual";
    BadgeTrigger["INNOVATION_CHALLENGE"] = "innovation_challenge_completion";
    BadgeTrigger["PROFILE_COMPLETE"] = "profile_complete";
    BadgeTrigger["FIRST_LOGIN"] = "first_login";
})(BadgeTrigger || (exports.BadgeTrigger = BadgeTrigger = {}));
let Badge = class Badge {
    name;
    description;
    iconUrl;
    color;
    trigger;
    isActive;
};
exports.Badge = Badge;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Badge.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Badge.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Badge.prototype, "iconUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#6366f1' }),
    __metadata("design:type", String)
], Badge.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: BadgeTrigger,
        default: BadgeTrigger.MANUAL,
    }),
    __metadata("design:type", String)
], Badge.prototype, "trigger", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Badge.prototype, "isActive", void 0);
exports.Badge = Badge = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Badge);
exports.BadgeSchema = mongoose_1.SchemaFactory.createForClass(Badge);
//# sourceMappingURL=badge.schema.js.map