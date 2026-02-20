import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { ChallengeInfo } from '@/lib/api/challenge';
import type { Post } from '@/types/feed';
import type { Meeting } from '@/types/meeting';

interface ModalStore {
  expenseCreate: { isOpen: boolean; challengeId: string | null };
  expenseDetail: { isOpen: boolean; challengeId: string | null; expenseId: string | null };
  expenseApprove: { isOpen: boolean; challengeId: string | null; expenseId: string | null };
  accessDenied: { isOpen: boolean; challengeId: string | null };
  attendance: { isOpen: boolean; meeting: Meeting | null };
  completeMeeting: { isOpen: boolean; meeting: Meeting | null };
  createMeeting: { isOpen: boolean; challengeId: string | null };
  creditCharge: { isOpen: boolean };
  delegateLeader: { isOpen: boolean; challengeId: string | null; currentLeaderId: string | null };
  deleteChallenge: { isOpen: boolean; challengeId: string | null; challengeTitle: string | null };
  editChallenge: { isOpen: boolean; challenge: ChallengeInfo | null };
  editMeeting: { isOpen: boolean; meeting: Meeting | null };
  editProfile: { isOpen: boolean };
  join: { isOpen: boolean; challengeId: string | null };
  leaveChallenge: { isOpen: boolean; challengeId: string | null; challengeTitle: string | null };
  login: { isOpen: boolean; redirectOnReject: string | null; returnTo: string | null; message: string | null };
  passwordReset: { isOpen: boolean };
  postDetail: { isOpen: boolean; post: Post | null };
  signup: { isOpen: boolean };
  supportPayment: { isOpen: boolean; challengeId: string | null; amount: number };
  supportSettings: { isOpen: boolean; challengeId: string | null };
  verification: { isOpen: boolean };
  withdraw: { isOpen: boolean };
  withdrawAccount: { isOpen: boolean };

  openExpenseCreate: (challengeId: string) => void;
  closeExpenseCreate: () => void;
  openExpenseDetail: (challengeId: string, expenseId: string) => void;
  closeExpenseDetail: () => void;
  openExpenseApprove: (challengeId: string, expenseId: string) => void;
  closeExpenseApprove: () => void;
  openAccessDenied: (challengeId: string) => void;
  closeAccessDenied: () => void;
  openAttendance: (meeting: Meeting) => void;
  closeAttendance: () => void;
  openCompleteMeeting: (meeting: Meeting) => void;
  closeCompleteMeeting: () => void;
  openCreateMeeting: (challengeId: string) => void;
  closeCreateMeeting: () => void;
  openCreditCharge: () => void;
  closeCreditCharge: () => void;
  openDelegateLeader: (challengeId: string, currentLeaderId: string) => void;
  closeDelegateLeader: () => void;
  openDeleteChallenge: (challengeId: string, challengeTitle: string) => void;
  closeDeleteChallenge: () => void;
  openEditChallenge: (challenge: ChallengeInfo) => void;
  closeEditChallenge: () => void;
  openEditMeeting: (meeting: Meeting) => void;
  closeEditMeeting: () => void;
  openEditProfile: () => void;
  closeEditProfile: () => void;
  openJoin: (challengeId?: string) => void;
  closeJoin: () => void;
  openLeaveChallenge: (challengeId: string, challengeTitle: string) => void;
  closeLeaveChallenge: () => void;
  openLogin: (options?: { redirectOnReject?: string; returnTo?: string; message?: string }) => void;
  closeLogin: () => void;
  openPasswordReset: () => void;
  closePasswordReset: () => void;
  openPostDetail: (post: Post) => void;
  closePostDetail: () => void;
  openSignup: () => void;
  closeSignup: () => void;
  openSupportPayment: (challengeId: string, amount: number) => void;
  closeSupportPayment: () => void;
  openSupportSettings: (challengeId: string) => void;
  closeSupportSettings: () => void;
  openVerification: () => void;
  closeVerification: () => void;
  openWithdraw: () => void;
  closeWithdraw: () => void;
  openWithdrawAccount: () => void;
  closeWithdrawAccount: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  expenseCreate: { isOpen: false, challengeId: null },
  expenseDetail: { isOpen: false, challengeId: null, expenseId: null },
  expenseApprove: { isOpen: false, challengeId: null, expenseId: null },
  accessDenied: { isOpen: false, challengeId: null },
  attendance: { isOpen: false, meeting: null },
  completeMeeting: { isOpen: false, meeting: null },
  createMeeting: { isOpen: false, challengeId: null },
  creditCharge: { isOpen: false },
  delegateLeader: { isOpen: false, challengeId: null, currentLeaderId: null },
  deleteChallenge: { isOpen: false, challengeId: null, challengeTitle: null },
  editChallenge: { isOpen: false, challenge: null },
  editMeeting: { isOpen: false, meeting: null },
  editProfile: { isOpen: false },
  join: { isOpen: false, challengeId: null },
  leaveChallenge: { isOpen: false, challengeId: null, challengeTitle: null },
  login: { isOpen: false, redirectOnReject: null, returnTo: null, message: null },
  passwordReset: { isOpen: false },
  postDetail: { isOpen: false, post: null },
  signup: { isOpen: false },
  supportPayment: { isOpen: false, challengeId: null, amount: 0 },
  supportSettings: { isOpen: false, challengeId: null },
  verification: { isOpen: false },
  withdraw: { isOpen: false },
  withdrawAccount: { isOpen: false },

  openExpenseCreate: challengeId => set({ expenseCreate: { isOpen: true, challengeId } }),
  closeExpenseCreate: () => set({ expenseCreate: { isOpen: false, challengeId: null } }),
  openExpenseDetail: (challengeId, expenseId) => set({ expenseDetail: { isOpen: true, challengeId, expenseId } }),
  closeExpenseDetail: () => set({ expenseDetail: { isOpen: false, challengeId: null, expenseId: null } }),
  openExpenseApprove: (challengeId, expenseId) => set({ expenseApprove: { isOpen: true, challengeId, expenseId } }),
  closeExpenseApprove: () => set({ expenseApprove: { isOpen: false, challengeId: null, expenseId: null } }),
  openAccessDenied: challengeId => set({ accessDenied: { isOpen: true, challengeId } }),
  closeAccessDenied: () => set({ accessDenied: { isOpen: false, challengeId: null } }),
  openAttendance: meeting => set({ attendance: { isOpen: true, meeting } }),
  closeAttendance: () => set({ attendance: { isOpen: false, meeting: null } }),
  openCompleteMeeting: meeting => set({ completeMeeting: { isOpen: true, meeting } }),
  closeCompleteMeeting: () => set({ completeMeeting: { isOpen: false, meeting: null } }),
  openCreateMeeting: challengeId => set({ createMeeting: { isOpen: true, challengeId } }),
  closeCreateMeeting: () => set({ createMeeting: { isOpen: false, challengeId: null } }),
  openCreditCharge: () => set({ creditCharge: { isOpen: true } }),
  closeCreditCharge: () => set({ creditCharge: { isOpen: false } }),
  openDelegateLeader: (challengeId, currentLeaderId) =>
    set({ delegateLeader: { isOpen: true, challengeId, currentLeaderId } }),
  closeDelegateLeader: () =>
    set({ delegateLeader: { isOpen: false, challengeId: null, currentLeaderId: null } }),
  openDeleteChallenge: (challengeId, challengeTitle) =>
    set({ deleteChallenge: { isOpen: true, challengeId, challengeTitle } }),
  closeDeleteChallenge: () =>
    set({ deleteChallenge: { isOpen: false, challengeId: null, challengeTitle: null } }),
  openEditChallenge: challenge => set({ editChallenge: { isOpen: true, challenge } }),
  closeEditChallenge: () => set({ editChallenge: { isOpen: false, challenge: null } }),
  openEditMeeting: meeting => set({ editMeeting: { isOpen: true, meeting } }),
  closeEditMeeting: () => set({ editMeeting: { isOpen: false, meeting: null } }),
  openEditProfile: () => set({ editProfile: { isOpen: true } }),
  closeEditProfile: () => set({ editProfile: { isOpen: false } }),
  openJoin: challengeId => set({ join: { isOpen: true, challengeId: challengeId || null } }),
  closeJoin: () => set({ join: { isOpen: false, challengeId: null } }),
  openLeaveChallenge: (challengeId, challengeTitle) =>
    set({ leaveChallenge: { isOpen: true, challengeId, challengeTitle } }),
  closeLeaveChallenge: () =>
    set({ leaveChallenge: { isOpen: false, challengeId: null, challengeTitle: null } }),
  openLogin: options =>
    set({
      login: {
        isOpen: true,
        redirectOnReject: options?.redirectOnReject || null,
        returnTo: options?.returnTo || null,
        message: options?.message || null,
      },
    }),
  closeLogin: () => set({ login: { isOpen: false, redirectOnReject: null, returnTo: null, message: null } }),
  openPasswordReset: () => set({ passwordReset: { isOpen: true } }),
  closePasswordReset: () => set({ passwordReset: { isOpen: false } }),
  openPostDetail: post => set({ postDetail: { isOpen: true, post } }),
  closePostDetail: () => set({ postDetail: { isOpen: false, post: null } }),
  openSignup: () => set({ signup: { isOpen: true } }),
  closeSignup: () => set({ signup: { isOpen: false } }),
  openSupportPayment: (challengeId, amount) =>
    set({ supportPayment: { isOpen: true, challengeId, amount } }),
  closeSupportPayment: () => set({ supportPayment: { isOpen: false, challengeId: null, amount: 0 } }),
  openSupportSettings: challengeId => set({ supportSettings: { isOpen: true, challengeId } }),
  closeSupportSettings: () => set({ supportSettings: { isOpen: false, challengeId: null } }),
  openVerification: () => set({ verification: { isOpen: true } }),
  closeVerification: () => set({ verification: { isOpen: false } }),
  openWithdraw: () => set({ withdraw: { isOpen: true } }),
  closeWithdraw: () => set({ withdraw: { isOpen: false } }),
  openWithdrawAccount: () => set({ withdrawAccount: { isOpen: true } }),
  closeWithdrawAccount: () => set({ withdrawAccount: { isOpen: false } }),
}));

export const useAccessDeniedModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.accessDenied.isOpen,
    challengeId: state.accessDenied.challengeId,
    onOpen: state.openAccessDenied,
    onClose: state.closeAccessDenied,
  })));

export const useExpenseCreateModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.expenseCreate.isOpen,
    challengeId: state.expenseCreate.challengeId,
    onOpen: state.openExpenseCreate,
    onClose: state.closeExpenseCreate,
  })));

export const useExpenseDetailModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.expenseDetail.isOpen,
    challengeId: state.expenseDetail.challengeId,
    expenseId: state.expenseDetail.expenseId,
    onOpen: state.openExpenseDetail,
    onClose: state.closeExpenseDetail,
  })));

export const useExpenseApproveModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.expenseApprove.isOpen,
    challengeId: state.expenseApprove.challengeId,
    expenseId: state.expenseApprove.expenseId,
    onOpen: state.openExpenseApprove,
    onClose: state.closeExpenseApprove,
  })));

export const useAttendanceModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.attendance.isOpen,
    meeting: state.attendance.meeting,
    onOpen: state.openAttendance,
    onClose: state.closeAttendance,
  })));

export const useCompleteMeetingModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.completeMeeting.isOpen,
    meeting: state.completeMeeting.meeting,
    onOpen: state.openCompleteMeeting,
    onClose: state.closeCompleteMeeting,
  })));

export const useCreateMeetingModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.createMeeting.isOpen,
    challengeId: state.createMeeting.challengeId,
    onOpen: state.openCreateMeeting,
    onClose: state.closeCreateMeeting,
  })));

export const useCreditChargeModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.creditCharge.isOpen,
    onOpen: state.openCreditCharge,
    onClose: state.closeCreditCharge,
  })));

export const useDelegateLeaderModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.delegateLeader.isOpen,
    challengeId: state.delegateLeader.challengeId,
    currentLeaderId: state.delegateLeader.currentLeaderId,
    onOpen: state.openDelegateLeader,
    onClose: state.closeDelegateLeader,
  })));

export const useDeleteChallengeModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.deleteChallenge.isOpen,
    challengeId: state.deleteChallenge.challengeId,
    challengeTitle: state.deleteChallenge.challengeTitle,
    onOpen: state.openDeleteChallenge,
    onClose: state.closeDeleteChallenge,
  })));

export const useEditChallengeModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.editChallenge.isOpen,
    challenge: state.editChallenge.challenge,
    onOpen: state.openEditChallenge,
    onClose: state.closeEditChallenge,
  })));

export const useEditMeetingModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.editMeeting.isOpen,
    meeting: state.editMeeting.meeting,
    onOpen: state.openEditMeeting,
    onClose: state.closeEditMeeting,
  })));

export const useEditProfileModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.editProfile.isOpen,
    onOpen: state.openEditProfile,
    onClose: state.closeEditProfile,
  })));

export const useJoinModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.join.isOpen,
    challengeId: state.join.challengeId,
    onOpen: state.openJoin,
    onClose: state.closeJoin,
  })));

export const useLeaveChallengeModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.leaveChallenge.isOpen,
    challengeId: state.leaveChallenge.challengeId,
    challengeTitle: state.leaveChallenge.challengeTitle,
    onOpen: state.openLeaveChallenge,
    onClose: state.closeLeaveChallenge,
  })));

export const useLoginModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.login.isOpen,
    redirectOnReject: state.login.redirectOnReject,
    returnTo: state.login.returnTo,
    message: state.login.message,
    onOpen: state.openLogin,
    onClose: state.closeLogin,
  })));

export const usePasswordResetModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.passwordReset.isOpen,
    onOpen: state.openPasswordReset,
    onClose: state.closePasswordReset,
  })));

export const usePostDetailModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.postDetail.isOpen,
    post: state.postDetail.post,
    onOpen: state.openPostDetail,
    onClose: state.closePostDetail,
  })));

export const useSignupModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.signup.isOpen,
    onOpen: state.openSignup,
    onClose: state.closeSignup,
  })));

export const useSupportPaymentModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.supportPayment.isOpen,
    challengeId: state.supportPayment.challengeId,
    amount: state.supportPayment.amount,
    onOpen: state.openSupportPayment,
    onClose: state.closeSupportPayment,
  })));

export const useSupportSettingsModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.supportSettings.isOpen,
    challengeId: state.supportSettings.challengeId,
    onOpen: state.openSupportSettings,
    onClose: state.closeSupportSettings,
  })));

export const useVerificationModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.verification.isOpen,
    onOpen: state.openVerification,
    onClose: state.closeVerification,
  })));

export const useWithdrawModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.withdraw.isOpen,
    onOpen: state.openWithdraw,
    onClose: state.closeWithdraw,
  })));

export const useWithdrawAccountModalStore = () =>
  useModalStore(useShallow(state => ({
    isOpen: state.withdrawAccount.isOpen,
    onOpen: state.openWithdrawAccount,
    onClose: state.closeWithdrawAccount,
  })));
