import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useTranslation } from '@/utils/i18n';
import { LoaderCircle } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { InputPassword } from '@/components/ui/input-password';

export default function Password() {
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

    // Manejar mensajes de estado
    const [updateStatus, setUpdateStatus] = useState<{
        success: boolean;
        error: boolean;
        message: string;
    }>({
        success: false,
        error: false,
        message: ''
    });

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        // Resetear estado al iniciar
        setUpdateStatus({ success: false, error: false, message: '' });

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Verificar si hay errores en la respuesta recibida del servidor
                // en lugar de usar el estado local de errores
                const responseErrors = page.props.errors || {};
                
                if (Object.keys(responseErrors).length > 0) {
                    // Si hay errores en la respuesta, no mostrar mensaje de éxito
                    // Los errores serán manejados por onError o se mostrarán automáticamente
                    return;
                }
                
                // Si llegamos aquí, significa que la operación fue exitosa
                reset();
                setUpdateStatus({
                    success: true,
                    error: false,
                    message: t('password_updated')
                });
                
                // Ocultar el mensaje después de 3 segundos
                setTimeout(() => {
                    setUpdateStatus(prev => ({ ...prev, success: false }));
                }, 3000);
            },
            onError: (errors) => {
                // Importante: asegurarse de que no hay mensajes de éxito
                setUpdateStatus(prev => ({ ...prev, success: false }));
                
                // Verificar si hay errores específicos
                const hasCurrentPasswordError = !!errors.current_password;
                
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (hasCurrentPasswordError) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                    
                    // Mostrar mensaje de error personalizado
                    setUpdateStatus({
                        success: false,
                        error: true,
                        message: t('current_password_incorrect')
                    });
                    
                    // Ocultar el mensaje después de 3 segundos
                    setTimeout(() => {
                        setUpdateStatus(prev => ({ ...prev, error: false }));
                    }, 3000);
                } else if (Object.keys(errors).length > 0) {
                    // Si hay otros errores pero no es de contraseña actual
                    setUpdateStatus({
                        success: false,
                        error: true,
                        message: t('error_occurred')
                    });
                    
                    setTimeout(() => {
                        setUpdateStatus(prev => ({ ...prev, error: false }));
                    }, 3000);
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('password_settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="text-[#7c28eb] dark:text-purple-300">
                        <HeadingSmall 
                            title={t('update_password')} 
                            description={t('ensure_account_security')} 
                        />
                    </div>

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
                            />

                            <InputError message={errors.current_password} className="text-red-500 text-sm" />
                        </div>

                        {/* Reemplazando el input normal por InputPassword para la nueva contraseña */}
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
                            />

                            <InputError message={errors.password_confirmation} className="text-red-500 text-sm" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button 
                                disabled={processing}
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

                            {/* Reemplazamos la transición original por nuestros mensajes personalizados */}
                            {updateStatus.success && (
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    {updateStatus.message || t('saved')}
                                </p>
                            )}
                            
                            {updateStatus.error && (
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {updateStatus.message || t('error_occurred')}
                                </p>
                            )}
                        </div>
                    </form>
                    
                    {/* Decorative element */}
                    <div 
                        className="h-1 w-full rounded-full opacity-80 mt-8"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
