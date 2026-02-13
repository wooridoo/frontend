import { Navigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export function AccountPage() {
  return <Navigate replace to={PATHS.MY.LEDGER} />;
}
