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
exports.CommunitySchema = exports.Community = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Community = class Community {
    name;
    description;
    slug;
    tag;
    isActive;
    memberCount;
};
exports.Community = Community;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Community.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Community.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, lowercase: true }),
    __metadata("design:type", String)
], Community.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], Community.prototype, "tag", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Community.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Community.prototype, "memberCount", void 0);
exports.Community = Community = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Community);
exports.CommunitySchema = mongoose_1.SchemaFactory.createForClass(Community);
//# sourceMappingURL=community.schema.js.map