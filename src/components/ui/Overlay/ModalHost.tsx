import { LoginModal } from '@/components/domain/Auth/LoginModal';
import { SignupModal } from '@/components/domain/Auth/SignupModal';
import { JoinChallengeModal } from '@/components/domain/Challenge/JoinChallengeModal';
import { CreditChargeModal } from '@/components/domain/Account/CreditChargeModal';
import { WithdrawModal } from '@/components/domain/Account/WithdrawModal';
import { AccessDeniedModal } from '@/components/domain/Auth/AccessDeniedModal';
import { PasswordResetModal } from '@/components/domain/Auth/PasswordResetModal';
import { EditProfileModal } from '@/components/domain/Auth/EditProfileModal';
import { WithdrawAccountModal } from '@/components/domain/Auth/WithdrawAccountModal';
import { CreateMeetingModal } from '@/components/domain/Meeting/CreateMeetingModal';
import { EditMeetingModal } from '@/components/domain/Meeting/EditMeetingModal';
import { AttendanceResponseModal } from '@/components/domain/Meeting/AttendanceResponseModal';
import { CompleteMeetingModal } from '@/components/domain/Meeting/CompleteMeetingModal';
import { EditChallengeModal } from '@/components/domain/Challenge/EditChallengeModal';
import { SupportSettingsModal } from '@/components/domain/Challenge/SupportSettingsModal';
import { DelegateLeaderModal } from '@/components/domain/Challenge/DelegateLeaderModal';
import { DeleteChallengeModal } from '@/components/domain/Challenge/DeleteChallengeModal';
import { LeaveChallengeModal } from '@/components/domain/Challenge/LeaveChallengeModal';
import { SupportPaymentModal } from '@/components/domain/Challenge/SupportPaymentModal';
import { PostDetailModal } from '@/components/domain/Challenge/Feed/PostDetailModal';
import { ExpenseCreateModal } from '@/components/domain/Challenge/Ledger/ExpenseCreateModal';
import { ExpenseDetailModal } from '@/components/domain/Challenge/Ledger/ExpenseDetailModal';
import { ExpenseApproveModal } from '@/components/domain/Challenge/Ledger/ExpenseApproveModal';
import { ConfirmDialog } from './ConfirmDialog';

export function ModalHost() {
  return (
    <>
      <LoginModal />
      <SignupModal />
      <JoinChallengeModal />
      <CreditChargeModal />
      <WithdrawModal />
      <AccessDeniedModal />
      <PasswordResetModal />
      <EditProfileModal />
      <WithdrawAccountModal />
      <CreateMeetingModal />
      <EditMeetingModal />
      <AttendanceResponseModal />
      <CompleteMeetingModal />
      <EditChallengeModal />
      <SupportSettingsModal />
      <DelegateLeaderModal />
      <DeleteChallengeModal />
      <LeaveChallengeModal />
      <SupportPaymentModal />
      <PostDetailModal />
      <ExpenseCreateModal />
      <ExpenseDetailModal />
      <ExpenseApproveModal />
      <ConfirmDialog />
    </>
  );
}
