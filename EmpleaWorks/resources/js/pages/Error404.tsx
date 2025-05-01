import { Head } from '@inertiajs/react';
import { NotFoundPage } from '@/components/ui/404-page-not-found';

export default function Error404() {
  return (
    <>
      <Head title="404 - Página no encontrada" />
      <NotFoundPage />
    </>
  );
}