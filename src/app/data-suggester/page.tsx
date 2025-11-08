import { AppLayout } from '@/components/app-layout';
import { DataSuggesterClient } from './data-suggester-client';

export default function DataSuggesterPage() {
  return (
    <AppLayout activeLink="suggester">
      <DataSuggesterClient />
    </AppLayout>
  );
}
