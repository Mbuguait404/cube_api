import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async findOrCreateConversation(participants: string[], isGeneral = false) {
    const participantIds = participants.map(id => new Types.ObjectId(id));

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

    // Find private conversation
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

  async createMessage(conversationId: string, senderId: string, content: string) {
    const message = await this.messageModel.create({
      conversation: new Types.ObjectId(conversationId),
      sender: new Types.ObjectId(senderId),
      content,
      readBy: [new Types.ObjectId(senderId)]
    });

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    return message.populate('sender', 'firstName lastName profilePhoto role');
  }

  async getConversations(userId: string) {
    return this.conversationModel.find({
      $or: [
        { participants: new Types.ObjectId(userId) },
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

  async getMessages(conversationId: string, limit = 50, skip = 0) {
    return this.messageModel.find({ conversation: new Types.ObjectId(conversationId) })
      .populate('sender', 'firstName lastName profilePhoto role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async markAsRead(messageId: string, userId: string) {
    return this.messageModel.findByIdAndUpdate(messageId, {
      $addToSet: { readBy: new Types.ObjectId(userId) }
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

  async lockGeneralChannel(isLocked: boolean) {
    return this.conversationModel.findOneAndUpdate(
      { isGeneral: true },
      { isLocked },
      { new: true }
    );
  }
}
