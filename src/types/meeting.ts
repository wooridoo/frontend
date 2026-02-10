/**
 * Meeting Domain Types
 */
export interface MeetingMember {
    userId: string;
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
    isOnline: boolean;
    // meetingUrl?: string; // Removed to align with API Spec
    // locationUrl?: string; // Removed to align with API Spec
    maxMembers: number;
    currentMembers: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
    members?: MeetingMember[];
    myStatus?: 'ATTENDING' | 'ABSENT' | 'PENDING' | 'NONE';
}
