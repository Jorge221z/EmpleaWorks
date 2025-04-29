import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLogo from '@/components/app-logo';
import { useTranslation } from '@/utils/i18n';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { t } = useTranslation();
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title={t('log_in')} />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Link href="/">
                            <AppLogo />
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight">{t('welcome_back')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('enter_email_to_sign_in')}
                        </p>
                    </div>

                    {status && (
                        <div className="rounded-md bg-primary/10 p-4 text-sm text-primary">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="w-full"
                                    autoComplete="username"
                                    placeholder={t('email_placeholder')}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-sm text-destructive">{errors.email}</div>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">{t('password')}</Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                                        >
                                            {t('forgot_your_password')}
                                        </Link>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    className="w-full"
                                    autoComplete="current-password"
                                    placeholder={t('password_placeholder')}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <div className="text-sm text-destructive">{errors.password}</div>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal">
                                    {t('remember_me')}
                                </Label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? t('signing_in') : t('sign_in')}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        {t('dont_have_account')}{' '}
                        <Link href={route('register')} className="underline underline-offset-4 hover:text-primary">
                            {t('sign_up')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
