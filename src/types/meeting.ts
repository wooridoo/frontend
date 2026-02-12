/**
 * Meeting Domain Types
 */
export interface MeetingMember {
    userId: string;
    nickname: string;
    profileImage?: string;
    status: 'AGREE' | 'DISAGREE' | 'PENDING';
    joinedAt?: string;
}

export interface Meeting {
    meetingId: string; // UUID (matches backend)
    challengeId: string;
    title: string;
    description: string;
    meetingDate: string; // ISO Date (matches backend)
    location: string;
    isOnline: boolean;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
    members?: MeetingMember[];

    // Nested Attendance Data from Backend
    attendance?: {
        confirmed: number;
        declined: number;
        pending: number;
        total: number;
    };
    myAttendance?: {
        status: 'AGREE' | 'DISAGREE' | 'PENDING' | 'NONE';
        respondedAt?: string;
    };

    // Deprecated: Use nested attendance properties instead
    currentMembers?: number;
    maxMembers?: number;
    myStatus?: 'AGREE' | 'DISAGREE' | 'PENDING' | 'NONE';
}
