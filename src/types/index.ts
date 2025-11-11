// User types
export enum Role {
  SuperAdmin = "super_admin",
  User = "user",
}

export interface IUser {
  _id: string;
  randomName: string;
  email: string;
  role: Role;
  isActive: boolean;
  totalMatches: number;
  activeMatches?: number;
  totalPhotos?: number;
  completedPhotos?: number;
  recentMatchedUsers: string[];
  notification?: {
    id: string;
    isActive: boolean;
  };
  timezone?: string;
  isBanned: boolean;
  banReason?: string;
  bannedUntil?: Date;
  bannedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Match types
export interface IMatch {
  _id: string;
  date: Date;
  user1Id: IUser;
  user2Id: IUser;
  isCompleted: boolean;
  completedAt?: Date;
  user1PhotosCount: number;
  user2PhotosCount: number;
  didUser1SeePartner: boolean;
  didUser2SeePartner: boolean;
  isBrokenByReport: boolean;
  reportId?: string;
  user1Photos?: IPhoto;
  user2Photos?: IPhoto;
  createdAt: Date;
  updatedAt: Date;
}

// Photo types
export enum ReactionType {
  LOVE = "love",
  FIRE = "fire",
  COOL = "cool",
  FUNNY = "funny",
  WOW = "wow",
  MEH = "meh",
}

export enum TimeType {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
  NIGHT = "night",
}

export interface IReaction {
  type: ReactionType;
  reactedAt: Date;
}

export interface IDailyTimePhoto {
  url: string;
  uploadedAt: Date;
  dailyTimeId: string;
  timeType: TimeType;
  isItSeenByPartner: boolean;
  reaction?: IReaction;
}

export interface IConceptPhoto {
  url: string;
  uploadedAt: Date;
  conceptId: string;
  isItSeenByPartner: boolean;
  reaction?: IReaction;
}

export interface IPhoto {
  _id: string;
  userId: string;
  date: Date;
  conceptPhoto?: IConceptPhoto;
  dailyTimesPhotos: IDailyTimePhoto[];
  isComplete: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Concept types
export interface IConcept {
  _id: string;
  date: string;
  concept: string;
  description: string;
  imageUrl?: string;
  activateDateTime: Date;
  uploadWindowMinutes: number;
  isActive: boolean;
  notificationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Daily Time types
export interface IDailyTime {
  _id: string;
  type: TimeType;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  createdAt: Date;
  updatedAt: Date;
}

// Report types
export enum ReportCategory {
  CHILD_SAFETY = "child-safety",
  INAPPROPRIATE = "inappropriate",
  SPAM = "spam",
  HARASSMENT = "harassment",
  FAKE = "fake",
  OTHER = "other",
}

export enum ReportStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under-review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IReport {
  _id: string;
  reporterId: IUser;
  reportedUserId: IUser;
  reportDate: Date;
  matchId: string;
  category: ReportCategory;
  customText?: string;
  status: ReportStatus;
  reviewedBy?: IUser;
  reviewedAt?: Date;
  adminNote?: string;
  didBreakMatch: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export enum NotificationType {
  PARTNER_NUDGE = "partner_nudge",
  ADMIN_NOTIFICATION = "admin_notification",
  SYSTEM = "system",
  PHOTO_REACTION = "photo_reaction",
  CONCEPT_ACTIVATED = "concept_activated",
}

export interface INotification {
  _id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  date?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Policy types
export interface IPolicy {
  _id: string;
  name: string;
  content: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard stats types
export interface IDashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalMatches: number;
  todayMatches: number;
  totalPhotos: number;
  totalReports: number;
  pendingReports: number;
  activeConcepts: number;
}
