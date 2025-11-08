import { AppLayout } from '@/components/app-layout';
import { DashboardClient } from '@/components/dashboard-client';

export default function Home() {
  return (
    <AppLayout activeLink="dashboard">
      <DashboardClient />
    </AppLayout>
  );
}
