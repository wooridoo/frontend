import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  CircleHelp,
  Coins,
  CreditCard,
  Dumbbell,
  FileText,
  Flame,
  FolderOpen,
  HandCoins,
  Heart,
  House,
  Landmark,
  LogOut,
  Palette,
  PieChart,
  PiggyBank,
  Plane,
  Search,
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
  | 'search'
  | 'home'
  | 'explore'
  | 'recommended'
  | 'logout'
  | 'charge'
  | 'withdraw'
  | 'notification'
  | 'default'
  | 'brixBadge'
  | 'heroCreate'
  | 'heroExplore'
  | 'categoryCulture'
  | 'categoryExercise'
  | 'categoryStudy'
  | 'categoryHobby'
  | 'categorySavings'
  | 'categoryTravel'
  | 'categoryFood'
  | 'categoryOther';

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
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
  search: Search,
  home: House,
  explore: Search,
  recommended: Heart,
  logout: LogOut,
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
  heroCreate: FolderOpen,
  heroExplore: ChartNoAxesColumnIncreasing,
  categoryCulture: Sparkles,
  categoryExercise: Dumbbell,
  categoryStudy: BookOpen,
  categoryHobby: Palette,
  categorySavings: PiggyBank,
  categoryTravel: Plane,
  categoryFood: UtensilsCrossed,
  categoryOther: CircleHelp,
};
