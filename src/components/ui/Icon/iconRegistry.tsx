import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleHelp,
  Coins,
  CreditCard,
  FileText,
  Flame,
  FolderOpen,
  HandCoins,
  Landmark,
  PieChart,
  UserRound,
  Users,
  Vote,
  Wallet,
} from 'lucide-react';

export type IconName =
  | 'action'
  | 'challenge'
  | 'empty'
  | 'feed'
  | 'hero'
  | 'ledger'
  | 'member'
  | 'meeting'
  | 'profile'
  | 'settings'
  | 'success'
  | 'vote'
  | 'wallet'
  | 'warning'
  | 'charge'
  | 'withdraw'
  | 'notification'
  | 'default';

export const iconRegistry: Record<IconName, LucideIcon> = {
  action: Flame,
  challenge: FolderOpen,
  empty: CircleHelp,
  feed: FileText,
  hero: PieChart,
  ledger: Landmark,
  member: Users,
  meeting: Bell,
  profile: UserRound,
  settings: Coins,
  success: CheckCircle2,
  vote: Vote,
  wallet: Wallet,
  warning: AlertTriangle,
  charge: CreditCard,
  withdraw: HandCoins,
  notification: Bell,
  default: CircleHelp,
};
