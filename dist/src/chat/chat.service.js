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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_schema_1 = require("./schemas/conversation.schema");
const message_schema_1 = require("./schemas/message.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let ChatService = class ChatService {
    conversationModel;
    messageModel;
    userModel;
    constructor(conversationModel, messageModel, userModel) {
        this.conversationModel = conversationModel;
        this.messageModel = messageModel;
        this.userModel = userModel;
    }
    async findOrCreateConversation(participants, isGeneral = false) {
        const participantIds = participants.map(id => new mongoose_2.Types.ObjectId(id));
        if (isGeneral) {
            let general = await this.conversationModel.findOne({ isGeneral: true });
            if (!general) {
                general = await this.conversationModel.create({
                    participants: [],
                    isGeneral: true,
                    isLocked: false
                });
            }
            return general;
        }
        let conversation = await this.conversationModel.findOne({
            isGeneral: false,
            participants: { $all: participantIds, $size: participantIds.length }
        });
        if (!conversation) {
            conversation = await this.conversationModel.create({
                participants: participantIds,
                isGeneral: false
            });
        }
        return conversation;
    }
    async createMessage(conversationId, senderId, content) {
        const message = await this.messageModel.create({
            conversation: new mongoose_2.Types.ObjectId(conversationId),
            sender: new mongoose_2.Types.ObjectId(senderId),
            content,
            readBy: [new mongoose_2.Types.ObjectId(senderId)]
        });
        await this.conversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date()
        });
        return message.populate('sender', 'firstName lastName profilePhoto role');
    }
    async getConversations(userId) {
        return this.conversationModel.find({
            $or: [
                { participants: new mongoose_2.Types.ObjectId(userId) },
                { isGeneral: true }
            ]
        })
            .populate('participants', 'firstName lastName profilePhoto role')
            .populate({
            path: 'lastMessage',
            populate: { path: 'sender', select: 'firstName lastName' }
        })
            .sort({ updatedAt: -1 });
    }
    async getMessages(conversationId, limit = 50, skip = 0) {
        return this.messageModel.find({ conversation: new mongoose_2.Types.ObjectId(conversationId) })
            .populate('sender', 'firstName lastName profilePhoto role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
    async markAsRead(messageId, userId) {
        return this.messageModel.findByIdAndUpdate(messageId, {
            $addToSet: { readBy: new mongoose_2.Types.ObjectId(userId) }
        }, { new: true });
    }
    async getAdmins() {
        return this.userModel.find({
            role: { $in: ['Admin', 'SuperAdmin'] }
        }, 'firstName lastName profilePhoto role');
    }
    async getMembers() {
        return this.userModel.find({
            role: 'Member'
        }, 'firstName lastName profilePhoto role');
    }
    async lockGeneralChannel(isLocked) {
        return this.conversationModel.findOneAndUpdate({ isGeneral: true }, { isLocked }, { new: true });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map