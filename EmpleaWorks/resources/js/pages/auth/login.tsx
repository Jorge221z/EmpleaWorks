import { Head } from '@inertiajs/react';
import { LoginForm } from '@/components/login-form';
import { useTranslation } from '@/utils/i18n';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
  const { t } = useTranslation();
  
  return (
    <>
      <Head title={t('log_in')} />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm status={status} canResetPassword={canResetPassword} />
        </div>
      </div>
    </>
  );
}
