import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { useTranslation } from '@/utils/i18n';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import { Toaster, showToast } from '@/components/toast';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { InputPassword } from '@/components/ui/input-password';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Password({ isGoogleUser = false }) {
    const { t } = useTranslation();
    
    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = '#7c28eb';
    const primaryHoverColor = '#6620c5';
    
    // Colores de acento (ámbar)
    const accentColor = '#FDC231';
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('password_settings'),
            href: '/settings/password',
        },
    ];
    
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Verificar si hay errores en la respuesta recibida del servidor
                const responseErrors = page.props.errors || {};
                
                if (Object.keys(responseErrors).length > 0) {
                    return;
                }
                
                reset();
                showToast.success(t('password_updated'));
            },
            onError: (errors) => {
                // Verificar si hay errores específicos
                const hasCurrentPasswordError = !!errors.current_password;
                
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (hasCurrentPasswordError) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                    showToast.error(t('current_password_incorrect'));
                } else if (Object.keys(errors).length > 0) {
                    showToast.error(t('error_occurred'));
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toaster />
            <Head title={t('password_settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="text-[#7c28eb] dark:text-purple-300">
                        <HeadingSmall 
                            title={t('update_password')} 
                            description={t('ensure_account_security')} 
                        />
                    </div>

                    {/* Alerta para usuarios de Google */}
                    {isGoogleUser && (
                        <Alert variant="warning" className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <AlertTitle className="text-amber-700 dark:text-amber-300 font-medium">
                                {t('google_account_notice')}
                            </AlertTitle>
                            <AlertDescription className="text-amber-600 dark:text-amber-400">
                                {t('google_password_change_info')}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label 
                                htmlFor="current_password" 
                                className="text-[#7c28eb] dark:text-purple-300 font-medium"
                            >
                                {t('current_password')}
                            </Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className={cn(
                                    "mt-1 block w-full",
                                    "border-gray-200 dark:border-gray-700",
                                    "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                    "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                )}
                                autoComplete="current-password"
                                placeholder={t('current_password')}
                                disabled={isGoogleUser}
                            />

                            <InputError message={errors.current_password} className="text-red-500 text-sm" />
                        </div>

                        <div className="grid gap-2">
                            <InputPassword
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(value) => setData('password', value)}
                                label={t('new_password')}
                                className="[&_label]:text-[#7c28eb] [&_label]:dark:text-purple-300 [&_label]:font-medium [&_input]:border-gray-200 [&_input]:dark:border-gray-700 [&_input]:focus-visible:ring-[#7c28eb] [&_input]:focus-visible:border-[#7c28eb]"
                                placeholder={t('new_password')}
                                required
                                disabled={isGoogleUser}
                            />
                            <InputError message={errors.password} className="text-red-500 text-sm" />
                        </div>

                        <div className="grid gap-2">
                            <Label 
                                htmlFor="password_confirmation" 
                                className="text-[#7c28eb] dark:text-purple-300 font-medium"
                            >
                                {t('confirm_password')}
                            </Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className={cn(
                                    "mt-1 block w-full",
                                    "border-gray-200 dark:border-gray-700",
                                    "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                    "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                )}
                                autoComplete="new-password"
                                placeholder={t('confirm_password')}
                                disabled={isGoogleUser}
                            />

                            <InputError message={errors.password_confirmation} className="text-red-500 text-sm" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button 
                                disabled={processing || isGoogleUser}
                                className="text-white"
                                style={{ 
                                    backgroundColor: primaryColor,
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = primaryHoverColor;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = primaryColor;
                                }}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
                                {t('save_password')}
                            </Button>
                            
                            {isGoogleUser && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/30"
                                    onClick={() => window.open('https://myaccount.google.com/security', '_blank')}
                                >
                                    {t('go_to_google_account')}
                                </Button>
                            )}
                        </div>
                    </form>
                    
                    {/* Elemento decorativo */}
                    <div 
                        className="h-1 w-full rounded-full opacity-80 mt-8"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
