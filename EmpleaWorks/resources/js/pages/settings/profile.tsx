import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Company, Candidate, User } from '@/types/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = { //solo hacemos que name y email sean obligatorios, los demas no tienen porque ser rellenados //
    name: string;    //esta logica concide con los campos de nuestro formulario, que no tienen 'required' como atributo //
    email: string;
    image?: File; 
    description?: string; 
    surname?: string; 
    cv?: File; 
    address?: string; 
    weblink?: string; 
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<{ auth: { user: User & { company?: Company; candidate?: Candidate } } }>().props;

    const role_id = auth.user.role_id; //sacamos el role id para pedir unos campos u otros en el formulario //
    
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        email: auth.user.email,
        image: undefined,
        description: typeof auth.user.description === 'string' ? auth.user.description : '',
        surname: role_id === 1 && auth.user.candidate?.surname ? auth.user.candidate.surname : undefined,
        cv: undefined,
        address: role_id === 2 && auth.user.company?.address ? auth.user.company.address : undefined,
        weblink: role_id === 2 && auth.user.company?.weblink ? auth.user.company.weblink : undefined,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const [imagePreview, setImagePreview] = useState<string | null>(
        auth.user.image ? String(auth.user.image) : null //recuperamos la imagen si la hubiese ya subida //
    );

    const [cvName, setCvName] = useState<string | null>(
        auth.user.cv ? String(auth.user.cv).split('/').pop() ?? null : null // Extraemos el nombre del archivo del path
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                                required
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
                                    //required  de momento no lo hacemos requerido porque no queremos que el usuario tenga que rellenar todos los campos obligatoriamente //
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
                                required
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
                                        //required  de momento no lo hacemos requerido porque no queremos que el usuario tenga que rellenar todos los campos obligatoriamente //
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
                                        //required  de momento no lo hacemos requerido porque no queremos que el usuario tenga que rellenar todos los campos obligatoriamente //
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
                                            {/* Icono de documento relleno cuando hay archivo */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-11 w-11 mb-2" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 5C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H7Z" />
                                                <path d="M9 9H15M9 13H15M9 17H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className='text-sm font-medium'>{cvName}</p>
                                            <button
                                                type="button"
                                                className="mt-2 text-xs text-red-600 hover:text-red-700 bg-red-200 hover:bg-red-300 rounded-md px-2 py-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData('cv', undefined);
                                                    setCvName(null);
                                                }}
                                            >
                                                Eliminar CV
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center text-gray-500 py-4'>
                                            {/* Icono de documento vacío cuando no hay archivo */}
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
                                    if (!data.image) { // Solo activar el clic si no hay imagen seleccionada
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
                                        // Crear vista previa
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            // Necesitamos actualizar un estado para la vista previa
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
                                                // Crear vista previa
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    // Necesitamos actualizar un estado para la vista previa
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
                                                e.stopPropagation(); // Evitar que se active el input de archivo
                                                setData('image', undefined);
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
                                //required  de momento no lo hacemos requerido porque no queremos que el usuario tenga que rellenar todos los campos obligatoriamente //
                                placeholder='Description'
                                rows={4}
                            />
                            <InputError className='mt-2' message={errors.description} />
                        </div>




                        
                            




                        


                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-md font-bold text-black dark:text-white">Saved</p>
                            </Transition> /*en el futuro pondremos un TOAST para hacer mas intutitivo el mensaje de guardado */
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
