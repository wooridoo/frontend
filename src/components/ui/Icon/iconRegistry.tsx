import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Coins,
  CreditCard,
  Dumbbell,
  FileText,
  Flame,
  FolderOpen,
  HandCoins,
  Landmark,
  Palette,
  PieChart,
  PiggyBank,
  Plane,
  Sparkles,
  UtensilsCrossed,
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
  | 'default'
  | 'brixBadge'
  | 'categoryCulture'
  | 'categoryExercise'
  | 'categoryStudy'
  | 'categoryHobby'
  | 'categorySavings'
  | 'categoryTravel'
  | 'categoryFood'
  | 'categoryOther';

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
  brixBadge: Coins,
  categoryCulture: Sparkles,
  categoryExercise: Dumbbell,
  categoryStudy: BookOpen,
  categoryHobby: Palette,
  categorySavings: PiggyBank,
  categoryTravel: Plane,
  categoryFood: UtensilsCrossed,
  categoryOther: CircleHelp,
};
