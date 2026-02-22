/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export interface MeetingMember {
    userId: string;
    nickname: string;
    profileImage?: string;
    status?: 'AGREE' | 'DISAGREE' | 'PENDING';
    joinedAt?: string;
}

export interface Meeting {
    meetingId: string;
    challengeId?: string;
    title: string;
    description?: string;
    meetingDate: string;
    location: string;
    locationDetail?: string;
    displayLocation?: string;
    isAttendanceVoteSource?: boolean;
    isOnline: boolean;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | string;
    members?: MeetingMember[];
    attendance?: {
        confirmed: number;
        declined: number;
        pending: number;
        total: number;
    };
    myAttendance?: {
        status: 'AGREE' | 'DISAGREE' | 'PENDING' | 'NONE' | string;
        respondedAt?: string;
    };
    createdBy?: {
        userId: string;
        nickname: string;
    };
    createdAt?: string;
    currentMembers?: number;
    maxMembers?: number;
    myStatus?: 'AGREE' | 'DISAGREE' | 'PENDING' | 'NONE';
}
