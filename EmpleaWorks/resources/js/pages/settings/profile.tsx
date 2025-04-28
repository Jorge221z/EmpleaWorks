import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Company, Candidate, User } from '@/types/types';
import toast, { Toaster } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

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

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<{ auth: { user: User & { company?: Company; candidate?: Candidate } } }>().props;
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

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

    // Mostramos los mensajes flash del backend
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('Datos antes de enviar:', data);
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const [imagePreview, setImagePreview] = useState<string | null>(
        auth.user.image ? `/storage/${auth.user.image}` : null
    );

    const [cvName, setCvName] = useState<string | null>(
        auth.user.candidate?.cv ? String(auth.user.candidate.cv).split('/').pop() ?? null : null
    );

    const cvUrl = auth.user.candidate?.cv ? `/storage/${auth.user.candidate.cv}` : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toaster
                position="bottom-center"
                toastOptions={{
                    className: 'toast-offers',
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '20px 28px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    id: 'unique-toast2',
                }}
            />
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your profile data" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        {role_id === 1 && (
                            <div className='grid gap-2'>
                                <Label htmlFor='surname'>Surname</Label>
                                <Input
                                    id='surname'
                                    className='mt-1 block w-full'
                                    value={data.surname}
                                    onChange={(e) => setData('surname', e.target.value)}
                                    autoComplete='surname'
                                    placeholder='Surname'
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {role_id === 2 && (
                            <div>
                                <div className='grid gap-2'>
                                    <Label htmlFor='address'>Company address</Label>
                                    <Input
                                        id='address'
                                        className='mt-1 block w-full'
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        autoComplete='address'
                                        placeholder='Company address'
                                    />

                                    <InputError className='mt-2' message={errors.address} />
                                </div>

                                <div className='grid gap-2 mt-6'>
                                    <Label htmlFor='weblink'>WebSite</Label>
                                    <Input
                                        id='weblink'
                                        type='url'
                                        className='mt-1 block w-full'
                                        value={data.weblink}
                                        onChange={(e) => setData('weblink', e.target.value)}
                                        autoComplete='weblink'
                                        placeholder='Company weblink'
                                    />
                                    <InputError className='mt-2' message={errors.weblink} />
                                </div>
                            </div>
                        )}

                        {role_id === 1 && (
                            <div className='grid gap-2'>
                                <Label htmlFor='cv'>Curriculum Vitae</Label>
                                <div
                                    className='relative border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors'
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
                                            alert('Por favor, sube solo archivos PDF o Word (DOC, DOCX)');
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
                                                    alert('Por favor, sube solo archivos PDF o Word (DOC, DOCX)');
                                                }
                                            }
                                        }}
                                        accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                    />

                                    {cvName ? (
                                        <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-11 w-11 mb-2" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 5C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H7Z" />
                                                <path d="M9 9H15M9 13H15M9 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className='text-sm font-medium'>{cvName}</p>
                                            <div className="flex space-x-2 mt-2">
                                                {(cvUrl || data.cv) && (
                                                    <a
                                                        href={data.cv ? URL.createObjectURL(data.cv) : cvUrl!}
                                                        download={cvName}
                                                        className="text-xs text-blue-600 hover:text-blue-700 bg-blue-200 hover:bg-blue-300 rounded-md px-2 py-1 flex items-center"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Descargar
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    className="text-xs text-red-600 hover:text-red-700 bg-red-200 hover:bg-red-300 rounded-md px-2 py-1 flex items-center"
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
                                                    Eliminar CV
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V7.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 1H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6M9 13h6M9 17h3" />
                                            </svg>
                                            <p className='font-medium'>Click here to select your CV file</p>
                                            <p className='text-sm'>or drag and drop here</p>
                                            <p className='text-xs text-gray-400 mt-1'>Accepted files: PDF, DOC, DOCX</p>
                                        </div>
                                    )}
                                </div>
                                <InputError className='mt-2' message={errors.cv} />
                            </div>
                        )}

                        <div className='grid gap-2'>
                            <Label htmlFor='image'>Imagen</Label>
                            <div
                                className='relative border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors'
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
                                        setData('image', file);
                                        setData('delete_image', false);
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setImagePreview(e.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    } else if (file) {
                                        alert('Please, just upload this type of files (JPG, PNG, GIF, etc.)');
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
                                                setData('image', file);
                                                setData('delete_image', false);
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    setImagePreview(event.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            } else {
                                                e.target.value = '';
                                                alert('Por favor, sube solo archivos de imagen (JPG, PNG, GIF, etc.)');
                                            }
                                        }
                                    }}
                                    accept='image/jpeg,image/png,image/gif,image/webp'
                                    placeholder='Image'
                                />

                                {imagePreview ? (
                                    <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="h-32 object-contain mb-2"
                                        />
                                        <p className='text-sm'>{data.image?.name}</p>
                                        <button
                                            type="button"
                                            className="mt-2 text-xs text-red-600 hover:text-red-700 bg-red-200 hover:bg-red-300 rounded-md px-2 py-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('image', undefined);
                                                setData('delete_image', true);
                                                setImagePreview(null);
                                            }}
                                        >
                                            Eliminar imagen
                                        </button>

                                        
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-12 mb-2" fill="none" viewBox="0 0 21 21" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className='font-medium'>Click here to select your image file</p>
                                        <p className='text-sm'>or drag and drop here</p>
                                        <p className='text-xs text-gray-400 mt-1'>Accepted files: JPG, PNG, GIF, WebP</p>
                                    </div>
                                )}
                            </div>
                            <InputError className='mt-2' message={errors.image} />
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='description'>Description</Label>
                            <textarea
                                id='description'
                                className='mt-1 block w-full min-h-[80px] p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input'
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder='Description'
                                rows={4}
                            />
                            <InputError className='mt-2' message={errors.description} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm"/>
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            {/* <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-md font-bold text-black dark:text-white">Saved</p>
                            </Transition> */}
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
