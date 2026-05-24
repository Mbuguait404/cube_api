import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { UniflowService } from '../integrations/uniflow/uniflow.service';
import { ChatGateway } from '../chat/chat.gateway';
import { UsersService } from '../users/users.service';
import { NotificationType } from './schemas/notification.schema';
import { Types } from 'mongoose';

@Injectable()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly uniflowService: UniflowService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  // Helper to resolve user preferences and info, then create/dispatch notifications
  private async dispatchNotification(options: {
    recipientId: string;
    senderId?: string;
    title: string;
    message: string;
    type: NotificationType;
    category: 'tasks' | 'comments' | 'dailyReports' | 'badges' | 'announcements';
    targetUrl?: string;
    metadata?: Record<string, any>;
    smsText?: string;
    emailSubject?: string;
    emailBody?: string;
  }) {
    try {
      const { recipientId, senderId, title, message, type, category, targetUrl, metadata, smsText, emailSubject, emailBody } = options;

      if (!recipientId || !Types.ObjectId.isValid(recipientId)) {
        this.logger.warn(`Invalid recipientId: ${recipientId}`);
        return;
      }

      const validSenderId = senderId && Types.ObjectId.isValid(senderId) ? senderId : undefined;

      // 1. Get user preferences
      const preferences = await this.notificationsService.getPreferences(recipientId);
      const recipient = await this.usersService.findById(recipientId);
      if (!recipient) {
        this.logger.warn(`Recipient user not found: ${recipientId}`);
        return;
      }

      // 2. In-App Notification Dispatch
      const prefCategory = preferences[category];
      if (!prefCategory || prefCategory.inApp !== false) { // Default to true if not set
        const notif = await this.notificationsService.create({
          recipient: recipientId,
          sender: validSenderId,
          title,
          message,
          type,
          targetUrl,
          metadata,
        });

        // Emit through WebSockets if gateway and client are available
        try {
          if (this.chatGateway?.server) {
            this.chatGateway.server.to(`user_${recipientId}`).emit('notification', notif);
          }
        } catch (wsErr) {
          this.logger.error(`WebSocket notification emit failed: ${wsErr.message}`);
        }
      }

      // 3. Email Notification Dispatch
      if (prefCategory?.email !== false && recipient.email) {
        const subject = emailSubject || title;
        const body = emailBody || message;
        try {
          await this.uniflowService.sendBulkEmail([recipient.email], subject, body);
        } catch (emailErr) {
          this.logger.error(`Email sending via Uniflow failed for ${recipient.email}: ${emailErr.message}`);
        }
      }

      // 4. SMS Notification Dispatch
      if (prefCategory?.sms === true && recipient.phone && smsText) {
        try {
          await this.uniflowService.sendSms(recipient.phone, smsText);
        } catch (smsErr) {
          this.logger.error(`SMS sending via Uniflow failed for ${recipient.phone}: ${smsErr.message}`);
        }
      }
    } catch (err) {
      this.logger.error(`Failed to dispatch notification: ${err.message}`);
    }
  }

  // ─── Event Handlers ────────────────────────────────────────────────────────

  @OnEvent('task.assigned')
  async handleTaskAssigned(payload: {
    task: any;
    assigneeIds: string[];
    creatorId: string;
    projectName: string;
  }) {
    const { task, assigneeIds, creatorId, projectName } = payload;
    const creator = await this.usersService.findById(creatorId);
    const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : 'An Admin';

    for (const assigneeId of assigneeIds) {
      const taskTitle = task.title;
      const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';

      await this.dispatchNotification({
        recipientId: assigneeId,
        senderId: creatorId,
        title: 'New Task Assigned',
        message: `You have been assigned to: "${taskTitle}" under Project: "${projectName}" by ${creatorName}.`,
        type: NotificationType.TASK,
        category: 'tasks',
        targetUrl: `/dashboard/tasks`,
        metadata: { taskId: task._id?.toString() },
        smsText: `The Cube: You have been assigned task "${taskTitle}" in Project "${projectName}". Due: ${dueDateStr}.`,
        emailSubject: `📋 New Task Assigned: ${taskTitle}`,
        emailBody: `Hi, you have been assigned to a new task:\n\n**Title**: ${taskTitle}\n**Project**: ${projectName}\n**Assigned By**: ${creatorName}\n**Due Date**: ${dueDateStr}\n\nLog in to the dashboard to review and track your tasks.`,
      });
    }
  }

  @OnEvent('task.status.changed')
  async handleTaskStatusChanged(payload: {
    task: any;
    oldStatus: string;
    newStatus: string;
    userId: string; // User who changed the status
    projectName: string;
  }) {
    const { task, oldStatus, newStatus, userId, projectName } = payload;
    const actor = await this.usersService.findById(userId);
    const actorName = actor ? `${actor.firstName} ${actor.lastName}` : 'A Team Member';

    // If status changed to 'in_review' or 'blocked', notify the project creator (usually admin/lead)
    const creatorId = task.createdBy?.toString() || task.createdBy?._id?.toString();
    const taskTitle = task.title;

    if (creatorId && creatorId !== userId) {
      let title = `Task Status Updated`;
      let message = `Task "${taskTitle}" in project "${projectName}" was updated to ${newStatus} by ${actorName}.`;
      let smsText = `The Cube: Task "${taskTitle}" changed to ${newStatus} by ${actorName}.`;
      let isUrgentSms = false;

      if (newStatus === 'in_review') {
        title = `Task Pending Review`;
        message = `"${taskTitle}" has been marked as IN REVIEW by ${actorName}. Please review deliverables.`;
      } else if (newStatus === 'blocked') {
        title = `⚠️ Task Blocked`;
        message = `"${taskTitle}" has been marked as BLOCKED by ${actorName}. Prompt resolution may be required.`;
        isUrgentSms = task.priority === 'urgent' || task.priority === 'high';
      }

      await this.dispatchNotification({
        recipientId: creatorId,
        senderId: userId,
        title,
        message,
        type: NotificationType.TASK,
        category: 'tasks',
        targetUrl: `/dashboard/tasks`,
        metadata: { taskId: task._id?.toString(), newStatus },
        smsText: isUrgentSms ? smsText : undefined,
        emailSubject: `🔔 Task "${taskTitle}" status change: ${newStatus.toUpperCase()}`,
        emailBody: `Hello,\n\nThe task **"${taskTitle}"** under Project **"${projectName}"** was updated:\n\n**Status Update**: ${oldStatus.toUpperCase()} ➔ ${newStatus.toUpperCase()}\n**Updated By**: ${actorName}\n\nPlease check the board to review any blockers or review requests.`,
      });
    }
  }

  @OnEvent('daily-report.submitted')
  async handleDailyReportSubmitted(payload: {
    report: any;
    authorName: string;
    projectName: string;
    projectLeadId: string;
  }) {
    const { report, authorName, projectName, projectLeadId } = payload;

    // Notify Project Lead about submission
    if (projectLeadId) {
      await this.dispatchNotification({
        recipientId: projectLeadId,
        senderId: report.author?.toString(),
        title: 'Daily Report Submitted',
        message: `${authorName} submitted their daily report for "${projectName}" (Mood: ${report.mood}).`,
        type: NotificationType.DAILY_REPORT,
        category: 'dailyReports',
        targetUrl: `/dashboard/daily-reports`,
        metadata: { reportId: report._id?.toString() },
      });
    }

    // Welfare check if logged mood is stressed
    if (report.mood === 'stressed' && projectLeadId) {
      await this.dispatchNotification({
        recipientId: projectLeadId,
        senderId: report.author?.toString(),
        title: '❤️ Welfare Check Alert',
        message: `${authorName} logged their mood as "stressed" in today's daily report for "${projectName}".`,
        type: NotificationType.DAILY_REPORT,
        category: 'dailyReports',
        targetUrl: `/dashboard/daily-reports`,
        metadata: { reportId: report._id?.toString(), stressAlert: true },
        emailSubject: `⚠️ Stress Mood Alert: ${authorName}`,
        emailBody: `Hello Admin/Project Lead,\n\nThis is an automated notification that **${authorName}** reported feeling **stressed** in their daily update for project **"${projectName}"**.\n\nChallenges reported:\n"${report.challenges || 'None specified'}"\n\nPlease check in with them to see how we can assist.`,
      });
    }
  }

  @OnEvent('comment.created')
  async handleCommentCreated(payload: {
    comment: any;
    targetType: string;
    targetTitle: string;
    taskAssigneeIds?: string[];
    recipientId?: string; // Specific recipient (like task owner or author)
    authorName: string;
  }) {
    const { comment, targetType, targetTitle, taskAssigneeIds, recipientId, authorName } = payload;
    const authorId = comment.author?.toString();

    // Determine all recipients
    const recipients = new Set<string>();
    if (recipientId) recipients.add(recipientId);
    if (taskAssigneeIds) {
      taskAssigneeIds.forEach((id) => recipients.add(id));
    }

    // Don't notify the person who wrote the comment
    recipients.delete(authorId);

    // Notify any explicitly @mentioned users in the comment
    if (comment.mentions && comment.mentions.length > 0) {
      for (const mentionId of comment.mentions) {
        const idStr = mentionId.toString();
        if (idStr !== authorId) {
          recipients.add(idStr);
          await this.dispatchNotification({
            recipientId: idStr,
            senderId: authorId,
            title: 'You were mentioned',
            message: `${authorName} mentioned you in a comment on ${targetType} "${targetTitle}".`,
            type: NotificationType.COMMENT,
            category: 'comments',
            targetUrl: targetType === 'task' ? `/dashboard/tasks` : `/dashboard/daily-reports`,
            metadata: { commentId: comment._id?.toString() },
            emailSubject: `💬 You were mentioned by ${authorName}`,
            emailBody: `Hi,\n\n${authorName} mentioned you in a comment on the task/report **"${targetTitle}"**:\n\n"${comment.content}"`,
          });
          // Remove from list so they don't get a duplicate generic comment notification
          recipients.delete(idStr);
        }
      }
    }

    // Dispatch generic comment notification to other followers
    for (const recipientId of recipients) {
      await this.dispatchNotification({
        recipientId,
        senderId: authorId,
        title: 'New Comment',
        message: `${authorName} commented on ${targetType} "${targetTitle}": "${comment.content.substring(0, 60)}..."`,
        type: NotificationType.COMMENT,
        category: 'comments',
        targetUrl: targetType === 'task' ? `/dashboard/tasks` : `/dashboard/daily-reports`,
        metadata: { commentId: comment._id?.toString() },
      });
    }
  }

  @OnEvent('badge.awarded')
  async handleBadgeAwarded(payload: {
    userId: string;
    badgeName: string;
    badgeDescription: string;
    adminId: string;
    reason: string;
  }) {
    const { userId, badgeName, badgeDescription, adminId, reason } = payload;
    const admin = await this.usersService.findById(adminId);
    const adminName = admin ? `${admin.firstName} ${admin.lastName}` : 'System Administrator';

    await this.dispatchNotification({
      recipientId: userId,
      senderId: adminId,
      title: '🎉 New Badge Awarded!',
      message: `Congratulations! You have been awarded the "${badgeName}" badge by ${adminName} for: "${reason}".`,
      type: NotificationType.BADGE,
      category: 'badges',
      targetUrl: `/dashboard/profile`,
      smsText: `The Cube: 🎉 Congrats! You have been awarded the "${badgeName}" badge for ${reason}.`,
      emailSubject: `🏆 Badge Earned: ${badgeName}`,
      emailBody: `Hi there,\n\nWe are excited to let you know that you've been awarded a new badge on The Cube!\n\n**Badge**: ${badgeName}\n**Description**: ${badgeDescription}\n**Reason**: ${reason}\n**Awarded By**: ${adminName}\n\nKeep up the excellent work! You can view this on your profile in the Member Portal.`,
    });
  }

  @OnEvent('announcement.created')
  async handleAnnouncementCreated(payload: {
    announcement: any;
    communityName: string;
    recipientIds: string[];
  }) {
    const { announcement, communityName, recipientIds } = payload;
    const authorId = announcement.author?.toString();
    const isCritical = announcement.isCritical || false;

    for (const recipientId of recipientIds) {
      if (recipientId === authorId) continue;

      await this.dispatchNotification({
        recipientId,
        senderId: authorId,
        title: isCritical ? '🚨 Critical Announcement' : '📢 New Announcement',
        message: `[${communityName}] ${announcement.title}`,
        type: NotificationType.ANNOUNCEMENT,
        category: 'announcements',
        targetUrl: `/dashboard/announcements`,
        metadata: { announcementId: announcement._id?.toString() },
        smsText: isCritical ? `The Cube 🚨 CRITICAL: ${announcement.title}. Details in Member Portal.` : undefined,
        emailSubject: `📢 Announcement [${communityName}]: ${announcement.title}`,
        emailBody: `Hello,\n\nA new announcement has been posted in the community cohort **"${communityName}"**:\n\n**${announcement.title}**\n\n${announcement.content}\n\nBest regards,\nThe Cube Admin Team`,
      });
    }
  }
}
