import { FormEventHandler, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import { useTranslation } from '@/utils/i18n';
import { InputPassword } from '@/components/ui/input-password';

export default function Register() {
    const { t } = useTranslation();
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title={t('register')} />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Link href="/">
                            <AppLogo />
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight">{t('create_an_account')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('enter_details_create_account')}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('name')}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full"
                                    autoComplete="name"
                                    autoFocus
                                    placeholder={t('name_placeholder')}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full"
                                    autoComplete="username"
                                    placeholder={t('email_placeholder')}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Role Selection - MEJORADO */}
                            <div className="space-y-2">
                                <Label htmlFor="role">{t('role')}</Label>
                                <Select
                                    name="role"
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                    disabled={processing}
                                    required
                                >
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder={t('select_role')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="candidate" className="cursor-pointer">
                                            {t('candidate')}
                                        </SelectItem>
                                        <SelectItem value="company" className="cursor-pointer">
                                            {t('company')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            {/* Password Field - Con verificador de seguridad */}
                            <div className="space-y-2">
                                <InputPassword
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(value) => setData('password', value)}
                                    label={t('password')}
                                    placeholder={t('password_placeholder')}
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">{t('confirm_password')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full"
                                    autoComplete="new-password"
                                    placeholder={t('password_placeholder')}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? t('registering') : t('register')}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        {t('already_have_account')}{' '}
                        <Link href={route('login')} className="underline underline-offset-4 hover:text-primary">
                            {t('sign_in')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
