import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/utils/i18n';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation();
    
    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = '#7c28eb';
    const primaryHoverColor = '#6620c5';
    const primaryLightColor = '#9645f4';
    
    // Colores de acento (ámbar)
    const accentColor = '#FDC231';
    const accentDarkColor = '#E3B100';
    const accentLightColor = '#FFDE7A';
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title={<span className="text-[#7c28eb] dark:text-purple-300">{t('reset_password')}</span>} 
            description={t('enter_new_password_below')}
            logoClassName="text-[#7c28eb] dark:text-purple-300"
        >
            <Head title={t('reset_password')} />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-6">
                    {/* Email Input - Readonly */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="email" 
                            className="text-[#7c28eb] dark:text-purple-300 font-medium"
                        >
                            {t('email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            className={cn(
                                "block w-full",
                                "border-gray-200 dark:border-gray-700",
                                "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500",
                                "bg-gray-50/50 dark:bg-gray-800/30"
                            )}
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="text-red-500 text-sm" />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="password" 
                            className="text-[#7c28eb] dark:text-purple-300 font-medium"
                        >
                            {t('password')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={data.password}
                            className={cn(
                                "block w-full",
                                "border-gray-200 dark:border-gray-700",
                                "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                            )}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t('password_placeholder')}
                        />
                        <InputError message={errors.password} className="text-red-500 text-sm" />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="password_confirmation" 
                            className="text-[#7c28eb] dark:text-purple-300 font-medium"
                        >
                            {t('confirm_password')}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            className={cn(
                                "block w-full",
                                "border-gray-200 dark:border-gray-700",
                                "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                            )}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder={t('confirm_password_placeholder')}
                        />
                        <InputError message={errors.password_confirmation} className="text-red-500 text-sm" />
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit"
                        className="w-full mt-2 text-white"
                        disabled={processing}
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
                        {processing && (
                            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {t('reset_password_button')}
                    </Button>
                </div>
            </form>

            {/* Decorative Element */}
            <div 
                className="absolute bottom-0 left-0 w-full h-1.5 opacity-80"
                style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
            />
        </AuthLayout>
    );
}
