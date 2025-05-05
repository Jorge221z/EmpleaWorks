// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/utils/i18n';
import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();
    
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-950 dark:to-purple-950/20 p-4">
            <div className="w-full max-w-md space-y-6">
                <Head title={t('forgot_password')} />

                <div className="flex flex-col items-center space-y-2 text-center">
                    <Link href="/">
                        <AppLogo className="h-16 w-16" />
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#7c28eb]">{t('forgot_password')}</h1>
                    <p className="text-sm text-muted-foreground">
                        {t('enter_email_reset_link')}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900/80 rounded-xl border border-purple-100 dark:border-purple-600/30 p-6 shadow-sm">
                    {status && (
                        <div className="mb-4 rounded-md bg-purple-100 dark:bg-purple-900/20 p-4 text-sm text-[#7c28eb] dark:text-purple-300">
                            {status}
                        </div>
                    )}

                    <div className="space-y-6">
                        <form onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[#9645f4] dark:text-[#c79dff]">{t('email_address')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('email_placeholder')}
                                    className="border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button 
                                    className="w-full bg-[#7c28eb] hover:bg-[#6620c5] dark:bg-[#7c28eb] dark:hover:bg-[#9645f4] text-white" 
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    {t('send_password_reset_link')}
                                </Button>
                            </div>
                        </form>

                        <div className="text-center text-sm">
                            {t('or_return_to')}{' '}
                            <Link href={route('login')} className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300">
                                {t('log_in')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
