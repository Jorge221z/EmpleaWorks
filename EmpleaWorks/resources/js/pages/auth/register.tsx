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
            <div className="flex min-h-screen items-center justify-center bg-background bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-950 dark:to-purple-950/20 p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Link href="/" className="flex items-center gap-2 group justify-center">
                            <AppLogo className="h-12 w-8 bg-transparent p-0 m-0" />
                            <span className="text-xl font-bold tracking-tight hover:text-purple-600 dark:hover:text-purple-300 transition-colors -ml-1">
                                EmpleaWorks
                            </span>
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight text-[#7c28eb]">{t('create_an_account')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('enter_details_create_account')}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 bg-white dark:bg-gray-900/80 rounded-xl border border-purple-100 dark:border-purple-600/30 p-6 shadow-sm">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[#9645f4] dark:text-[#c79dff]">{t('name')}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
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
                                <Label htmlFor="email" className="text-[#9645f4] dark:text-[#c79dff]">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
                                    autoComplete="username"
                                    placeholder={t('email_placeholder')}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-[#9645f4] dark:text-[#c79dff]">{t('role')}</Label>
                                <Select
                                    name="role"
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                    disabled={processing}
                                    required
                                >
                                    <SelectTrigger 
                                        id="role" 
                                        className="w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
                                    >
                                        <SelectValue placeholder={t('select_role')} />
                                    </SelectTrigger>
                                    <SelectContent className="border-purple-100 dark:border-purple-600/30 dark:bg-gray-900">
                                        <SelectItem value="candidate" className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb]">
                                            {t('candidate')}
                                        </SelectItem>
                                        <SelectItem value="company" className="cursor-pointer focus:bg-purple-50 dark:focus:bg-purple-900/20 focus:text-[#7c28eb]">
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
                                    className="[&_label]:text-[#9645f4] [&_label]:dark:text-[#c79dff] [&_input]:border-purple-100 [&_input]:dark:border-purple-600/30 [&_input]:focus-visible:ring-[#7c28eb]"
                                    placeholder={t('password_placeholder')}
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-[#9645f4] dark:text-[#c79dff]">{t('confirm_password')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
                                    autoComplete="new-password"
                                    placeholder={t('password_placeholder')}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-[#7c28eb] hover:bg-[#6620c5] dark:bg-[#7c28eb] dark:hover:bg-[#9645f4] text-white" 
                            disabled={processing}
                        >
                            {processing ? t('registering') : t('register')}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        {t('already_have_account')}{' '}
                        <Link href={route('login')} className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300">
                            {t('sign_in')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
