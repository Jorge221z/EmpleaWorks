import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Company, Candidate, User } from '@/types/types';
import { Toaster, showToast } from '@/components/toast';
import { useTranslation } from '@/utils/i18n';
import { cn } from '@/lib/utils';

type ProfileForm = {
    name: string;
    email: string;
    image?: File;
    delete_image?: boolean;
    description?: string;
    surname?: string;
    cv?: File;
    delete_cv?: boolean;
    address?: string;
    weblink?: string;
}

export default function Profile({ mustVerifyEmail, status, isGoogleUser = false }: { mustVerifyEmail: boolean; status?: string; isGoogleUser: boolean; }) {
    const { auth } = usePage<{ auth: { user: User & { company?: Company; candidate?: Candidate } } }>().props;
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const { t } = useTranslation();

    // ----- COLOR THEMING SYSTEM -----
    // Colores principales (púrpura)
    const primaryColor = '#7c28eb';
    const primaryHoverColor = '#6620c5';
    
    // Colores de acento (ámbar)
    const accentColor = '#FDC231';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('profile_settings'),
            href: '/settings/profile',
        },
    ];

    const role_id = auth.user.role_id;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        email: auth.user.email,
        image: undefined,
        delete_image: false,
        description: typeof auth.user.description === 'string' ? auth.user.description : '',
        surname: role_id === 1 && auth.user.candidate?.surname ? auth.user.candidate.surname : undefined,
        cv: undefined,
        delete_cv: false,
        address: role_id === 2 && auth.user.company?.address ? auth.user.company.address : undefined,
        weblink: role_id === 2 && auth.user.company?.web_link ? auth.user.company.web_link : undefined,
    });

    // Estado para animación drag over global
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    // Mostramos los mensajes flash del backend
    useEffect(() => {
        if (flash && flash.success) {
            showToast.success(flash.success);
        }
        if (flash && flash.error) {
            showToast.error(flash.error);
        }
    }, [flash]);

    // Prevenir el comportamiento por defecto de drag & drop globalmente y animar cuadros
    useEffect(() => {
        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current++;
            setIsDragging(true);
        };
        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current--;
            if (dragCounter.current <= 0) {
                setIsDragging(false);
            }
        };
        const preventDefault = (e: DragEvent) => {
            e.preventDefault();
        };
        window.addEventListener('dragover', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('drop', (e) => {
            dragCounter.current = 0;
            setIsDragging(false);
            preventDefault(e);
        });
        return () => {
            window.removeEventListener('dragover', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('drop', preventDefault);
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };
    
    // La imagen y el cv se manejan de distnta forma porque se guardan como strings con su ruta en la bd y luego se recuperan desde esa referencia
    const [imagePreview, setImagePreview] = useState<string | null>(
        auth.user.image ? `/storage/${auth.user.image}` : null
    );

    const [cvName, setCvName] = useState<string | null>(
        auth.user.candidate?.cv ? String(auth.user.candidate.cv).split('/').pop() ?? null : null
    );

    const cvUrl = auth.user.candidate?.cv ? `/storage/${auth.user.candidate.cv}` : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toaster />
            <Head title={t('profile_settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="text-[#7c28eb] dark:text-purple-300">
                        <HeadingSmall 
                            title={t('profile_information')} 
                            description={t('update_profile_data')} 
                        />
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label 
                                htmlFor="name" 
                                className="text-[#7c28eb] dark:text-purple-300 font-medium"
                            >
                                {t('name')}
                            </Label>
                            <Input
                                id="name"
                                className={cn(
                                    "mt-1 block w-full",
                                    "border-gray-200 dark:border-gray-700",
                                    "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                    "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                )}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                placeholder={t('full_name')}
                            />
                            <InputError className="text-red-500 text-sm" message={errors.name} />
                        </div>

                        {role_id === 1 && (
                            <div className='grid gap-2'>
                                <Label 
                                    htmlFor='surname'
                                    className="text-[#7c28eb] dark:text-purple-300 font-medium"
                                >
                                    {t('surname')}
                                </Label>
                                <Input
                                    id='surname'
                                    className={cn(
                                        "mt-1 block w-full",
                                        "border-gray-200 dark:border-gray-700",
                                        "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                        "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                    )}
                                    value={data.surname}
                                    onChange={(e) => setData('surname', e.target.value)}
                                    autoComplete='surname'
                                    placeholder={t('surname')}
                                />
                                <InputError className="text-red-500 text-sm" message={errors.surname} />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label 
                                htmlFor="email"
                                className="text-[#7c28eb] dark:text-purple-300 font-medium"
                            >
                                {t('email_address')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className={cn(
                                    "mt-1 block w-full",
                                    "border-gray-200 dark:border-gray-700",
                                    "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                    "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                )}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                placeholder={t('email_address')}
                            />
                            <InputError className="text-red-500 text-sm" message={errors.email} />
                        </div>

                        {role_id === 2 && (
                            <div>
                                <div className='grid gap-2'>
                                    <Label 
                                        htmlFor='address'
                                        className="text-[#7c28eb] dark:text-purple-300 font-medium"
                                    >
                                        {t('company_address')}
                                    </Label>
                                    <Input
                                        id='address'
                                        className={cn(
                                            "mt-1 block w-full",
                                            "border-gray-200 dark:border-gray-700",
                                            "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                            "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                        )}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        autoComplete='address'
                                        placeholder={t('company_address')}
                                    />
                                    <InputError className="text-red-500 text-sm" message={errors.address} />
                                </div>

                                <div className='grid gap-2 mt-6'>
                                    <Label 
                                        htmlFor='weblink'
                                        className="text-[#7c28eb] dark:text-purple-300 font-medium"
                                    >
                                        {t('website')}
                                    </Label>
                                    <Input
                                        id='weblink'
                                        type='string'
                                        className={cn(
                                            "mt-1 block w-full",
                                            "border-gray-200 dark:border-gray-700",
                                            "focus-visible:ring-[#7c28eb] dark:focus-visible:ring-purple-500",
                                            "focus-visible:border-[#7c28eb] dark:focus-visible:border-purple-500"
                                        )}
                                        value={data.weblink}
                                        onChange={(e) => setData('weblink', e.target.value)}
                                        onBlur={() => {
                                            if (data.weblink && !data.weblink.match(/^https?:\/\//)) {
                                                setData('weblink', `https://${data.weblink}`);
                                            }
                                        }}
                                        autoComplete='weblink'
                                        placeholder={t('company_website')}
                                    />
                                    <InputError className="text-red-500 text-sm" message={errors.weblink} />
                                </div>
                            </div>
                        )}

                        {role_id === 1 && (
                            <div className='grid gap-2'>
                                <Label 
                                    htmlFor='cv'
                                    className="text-[#7c28eb] dark:text-purple-300 font-medium"
                                >
                                    {t('curriculum_vitae')}
                                </Label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
                                        ${isDragging 
                                            ? 'border-[#7c28eb] animate-pulse shadow-lg' 
                                            : 'border-gray-300 dark:border-gray-700 hover:border-[#7c28eb] dark:hover:border-purple-500'}
                                `}
                                onClick={() => {
                                    const cvInput = document.getElementById('cv');
                                    if (cvInput) {
                                        cvInput.click();
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer?.files?.[0];
                                    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                                        setData('cv', file);
                                        setData('delete_cv', false);
                                        setCvName(file.name);
                                    } else if (file) {
                                        showToast.error(t('only_pdf_doc'));
                                    }
                                }}
                            >
                                    <Input
                                        id='cv'
                                        type='file'
                                        className='hidden'
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                                                    setData('cv', file);
                                                    setData('delete_cv', false);
                                                    setCvName(file.name);
                                                } else {
                                                    e.target.value = '';
                                                    showToast.error(t('only_pdf_doc'));
                                                }
                                            }
                                        }}
                                        accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                    />

                                    {cvName ? (
                                        <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-11 w-11 mb-2 text-[#7c28eb] dark:text-purple-300" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 5C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H7Z" />
                                                <path d="M9 9H15M9 13H15M9 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className='text-sm font-medium'>{cvName}</p>
                                            <div className="flex space-x-2 mt-2">
                                                {(cvUrl || data.cv) && (
                                                    <a
                                                        href={data.cv ? URL.createObjectURL(data.cv) : cvUrl!}
                                                        download={cvName}
                                                        className="text-xs text-[#7c28eb] hover:text-[#6620c5] bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 rounded-md px-2 py-1 flex items-center"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        {t('download')}
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    className="text-xs text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md px-2 py-1 flex items-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setData('cv', undefined);
                                                        setData('delete_cv', true);
                                                        setCvName(null);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    {t('delete_cv')}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-[#7c28eb] dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6M9 13h6M9 17h3" />
                                            </svg>
                                            <p className='font-medium'>{t('click_select_cv')}</p>
                                            <p className='text-sm'>{t('drag_drop_here')}</p>
                                            <p className='text-xs text-gray-400 mt-1'>{t('accepted_files_docs')}</p>
                                        </div>
                                    )}
                                </div>
                                <InputError className="text-red-500 text-sm" message={errors.cv} />
                            </div>
                        )}

                        <div className='grid gap-2'>
                            <Label 
                                htmlFor='image'
                                className="text-[#7c28eb] dark:text-purple-300 font-medium"
                            >
                                {t('image')}
                            </Label>
                            <div
                                className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
                                    ${isDragging 
                                        ? 'border-[#7c28eb] animate-pulse shadow-lg' 
                                        : 'border-gray-300 dark:border-gray-700 hover:border-[#7c28eb] dark:hover:border-purple-500'}
                                `}
                                onClick={() => {
                                    if (!data.image) {
                                        const imageInput = document.getElementById('image');
                                        if (imageInput) {
                                            imageInput.click();
                                        }
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer?.files?.[0];
                                    if (file && file.type.startsWith('image/')) {
                                        if (file.size > 2 * 1024 * 1024) {
                                            showToast.error(t('image_too_large', { size: '2MB' }));
                                            return;
                                        }
                                        setData('image', file);
                                        setData('delete_image', false);
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setImagePreview(e.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    } else if (file) {
                                        showToast.error(t('only_image_files'));
                                    }
                                }}
                            >
                                <Input
                                    id='image'
                                    type='file'
                                    className='hidden'
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            if (file.type.startsWith('image/')) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    e.target.value = '';
                                                    showToast.error(t('image_too_large', { size: '2MB' }));
                                                    return;
                                                }
                                                setData('image', file);
                                                setData('delete_image', false);
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    setImagePreview(event.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            } else {
                                                e.target.value = '';
                                                showToast.error(t('only_image_files'));
                                            }
                                        }
                                    }}
                                    accept='image/jpeg,image/png,image/gif,image/webp'
                                    placeholder={t('image')}
                                />

                                {imagePreview ? (
                                    <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                        <img
                                            src={imagePreview}
                                            alt={t('preview')}
                                            className="h-32 object-contain mb-2 rounded-md border border-gray-200 dark:border-gray-700"
                                        />
                                        <p className='text-sm'>{data.image?.name}</p>
                                        <button
                                            type="button"
                                            className="mt-2 text-xs text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md px-2 py-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('image', undefined);
                                                setData('delete_image', true);
                                                setImagePreview(null);
                                            }}
                                        >
                                            {t('delete_image')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-12 mb-2 text-[#7c28eb] dark:text-purple-300" fill="none" viewBox="0 0 21 21" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className='font-medium'>{t('click_select_image')}</p>
                                        <p className='text-sm'>{t('drag_drop_here')}</p>
                                        <p className='text-xs text-gray-400 mt-1'>{t('accepted_files_images')}</p>
                                    </div>
                                )}
                            </div>
                            <InputError className="text-red-500 text-sm" message={errors.image} />
                        </div>

                        <div className='grid gap-2'>
                            <Label 
                                htmlFor='description'
                                className="text-[#7c28eb] dark:text-purple-300 font-medium"
                            >
                                {t('description')}
                            </Label>
                            <textarea
                                id='description'
                                className='mt-1 block w-full min-h-[80px] p-3 border border-gray-200 dark:border-gray-700 rounded-md 
                                    focus:outline-none focus:ring-2 focus:ring-[#7c28eb] dark:focus:ring-purple-500 
                                    focus:border-[#7c28eb] dark:focus:border-purple-500'
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={t('description')}
                                rows={4}
                            />
                            <InputError className="text-red-500 text-sm" message={errors.description} />
                        </div>

                        {mustVerifyEmail && (
                            <div>
                                {/* Mostrar estado de verificación del email */}
                                {auth.user.email_verified_at === null ? (
                                    <div className="flex items-center gap-2 mb-2 text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6M9 9l6 6" />
                                        </svg>
                                        {t('email_not_verified')}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mb-2 text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('email_verified')}
                                    </div>
                                )}
                            </div>
                        )}

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
                                {t('save')}
                            </Button>
                            
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    {t('saved')}
                                </p>
                            </Transition>
                        </div>
                    </form>
                    
                    {/* Elemento decorativo */}
                    <div 
                        className="h-1 w-full rounded-full opacity-80 mt-8"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}
                    />
                </div>

                <DeleteUser isGoogleUser={isGoogleUser} />
            </SettingsLayout>
        </AppLayout>
    );
}
