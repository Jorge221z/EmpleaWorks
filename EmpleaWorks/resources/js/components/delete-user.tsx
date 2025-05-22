import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useTranslation } from '@/utils/i18n';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeadingSmall from '@/components/heading-small';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function DeleteUser({ isGoogleUser = false }) {
    const { t } = useTranslation();
    const passwordInput = useRef<HTMLInputElement>(null);
    
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<{ password: string; confirmation?: boolean }>({ 
        password: '',
        confirmation: false
    });
    
    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        // Para usuarios de Google, enviamos el formulario sin validación de contraseña
        if (isGoogleUser) {
            destroy(route('profile.destroy'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } else {
            // Para usuarios normales, verificamos la contraseña
            destroy(route('profile.destroy'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onError: () => passwordInput.current?.focus(),
                onFinish: () => reset(),
            });
        }
    };

    const closeModal = () => {
        setDialogOpen(false);
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="text-[#7c28eb] dark:text-purple-300">
                <HeadingSmall 
                    title={t('delete_account')} 
                    description={t('delete_account_resources')}
                />
            </div>
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{t('warning')}</p>
                    <p className="text-sm">{t('caution_cannot_undo')}</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">{t('delete_account')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>{t('confirm_delete_account')}</DialogTitle>
                        
                        {isGoogleUser ? (
                            // Contenido específico para usuarios de Google
                            <DialogDescription>
                                {t('delete_account_confirmation')}
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded text-amber-700 dark:text-amber-300 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p>
                                            {t('google_account_notice')}
                                        </p>
                                    </div>
                                </div>
                            </DialogDescription>
                        ) : (
                            // Contenido original para usuarios normales
                            <DialogDescription>
                                {t('delete_account_confirmation')}
                            </DialogDescription>
                        )}
                        
                        <form className="space-y-6" onSubmit={deleteUser}>
                            {!isGoogleUser && (
                                // Campo de contraseña solo para usuarios normales
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-gray-600 dark:text-gray-400">
                                        {t('password')}
                                    </Label>

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder={t('enter_password')}
                                        autoComplete="current-password"
                                        className={cn(
                                            "border-gray-200 dark:border-gray-700",
                                            "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                            "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                        )}
                                    />

                                    <InputError message={errors.password} className="text-red-500 text-sm" />
                                </div>
                            )}

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={closeModal}>
                                        {t('cancel')}
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} asChild>
                                    <button type="submit">{t('delete_account')}</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
