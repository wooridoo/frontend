/**
 * Meeting Domain Types
 */
export interface MeetingMember {
    userId: number;
    nickname: string;
    profileImage?: string;
    status: 'ATTENDING' | 'ABSENT' | 'PENDING';
    joinedAt?: string;
}

export interface Meeting {
    id: string; // UUID
    challengeId: string;
    title: string;
    description: string;
    date: string; // ISO Date
    location: string;
    locationUrl?: string; // Map link
    isOnline: boolean;
    meetingUrl?: string; // Online meeting link (Added based on API specs commonly having this for online meetings)
    maxMembers: number;
    currentMembers: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
    members?: MeetingMember[];
    myStatus?: 'ATTENDING' | 'ABSENT' | 'PENDING' | 'NONE';
}
