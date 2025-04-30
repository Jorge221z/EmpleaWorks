import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/utils/i18n';
import { type BreadcrumbItem } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

export default function Terms() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("terms");

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
        {
            title: activeTab === "terms" ? t('terms_and_conditions') : t('cookies_policy'),
            href: route('terms'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={activeTab === "terms" ? t('terms_title') : t('cookies_title')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="px-2">
                    <h2 className="text-3xl font-semibold mb-2">
                        {activeTab === "terms" ? t('terms_title') : t('cookies_title')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {activeTab === "terms" ? t('terms_subtitle') : t('cookies_subtitle')}
                    </p>

                    <div className="bg-card border border-sidebar-border/70 dark:border-sidebar-border rounded-xl overflow-hidden">
                        <div className="border-b border-sidebar-border/70 dark:border-sidebar-border p-1 bg-muted/50">
                            <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent">
                                    <TabsTrigger 
                                        value="terms"
                                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        {t('terms_and_conditions')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="cookies"
                                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        {t('cookies_policy')}
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Contenido de las pestañas */}
                        <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            {/* Términos y Condiciones */}
                            <TabsContent value="terms" className="p-6 md:p-8 relative">
                                <div className="prose dark:prose-invert max-w-none relative z-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Tabla de contenidos - Barra lateral */}
                                        <div className="md:w-64 lg:w-72 shrink-0">
                                            <div className="md:sticky md:top-4">
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border mb-6">
                                                    <h3 className="text-lg font-medium mb-3">{t('table_of_contents')}</h3>
                                                    <nav className="space-y-1 text-sm">
                                                        <a href="#terminos-de-uso" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">1. {t('terms_of_use')}</a>
                                                        <a href="#proteccion-de-datos" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">2. {t('data_protection')}</a>
                                                        <a href="#uso-de-la-informacion" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">3. {t('use_of_information')}</a>
                                                        <a href="#derechos-rgpd" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">4. {t('gdpr_rights')}</a>
                                                        <a href="#retencion-de-datos" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">5. {t('data_retention')}</a>
                                                        <a href="#seguridad" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">6. {t('security')}</a>
                                                        <a href="#cookies" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">7. {t('cookies_tracking')}</a>
                                                        <a href="#limitacion-de-responsabilidad" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">8. {t('liability_limitation')}</a>
                                                        <a href="#modificaciones" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">9. {t('modifications')}</a>
                                                        <a href="#ley-aplicable" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">10. {t('applicable_law')}</a>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenido principal */}
                                        <div className="flex-1">
                                            {/* Secciones de términos y condiciones */}
                                            <section id="terminos-de-uso">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">1. {t('terms_of_use')}</h3>
                                                <p>Al registrarte y utilizar la plataforma EmpleaWorks, aceptas estos términos y condiciones en su totalidad. Estos términos constituyen un acuerdo legal entre tú y EmpleaWorks. Si no estás de acuerdo con estos términos, no debes registrarte ni utilizar la plataforma.</p>
                                            </section>

                                            <section id="proteccion-de-datos" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">2. {t('data_protection')}</h3>
                                                <p>Al solicitar un empleo a través de EmpleaWorks, consientes que tus datos personales, incluido tu currículum vitae, sean procesados y compartidos con la empresa ofertante para fines exclusivamente relacionados con el proceso de selección. Este procesamiento se basa en tu consentimiento explícito y en la necesidad para la ejecución de la solicitud de empleo, de acuerdo con el Artículo 6(1)(a) y (b) del RGPD.</p>
                                            </section>
                                            
                                            {/* Resto de secciones de términos (sin cambios) */}
                                            <section id="uso-de-la-informacion" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">3. {t('use_of_information')}</h3>
                                                <p>Las empresas que reciben tus datos personales a través de EmpleaWorks actúan como responsables del tratamiento y se comprometen a utilizarlos únicamente con fines de selección y contratación, de acuerdo con la legislación aplicable. No podrán ceder tus datos a terceros sin tu consentimiento explícito.</p>
                                            </section>

                                            <section id="derechos-rgpd" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">4. {t('gdpr_rights')}</h3>
                                                <p>De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes derecho a acceder, rectificar, limitar, eliminar, oponerte al procesamiento y solicitar la portabilidad de tus datos personales. Para ejercer estos derechos, puedes contactar con nosotros a través de <a href="mailto:empleaworks@gmail.com" className="text-primary hover:underline">empleaworks@gmail.com</a>.</p>
                                            </section>

                                            <section id="retencion-de-datos" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">5. {t('data_retention')}</h3>
                                                <p>Los datos proporcionados durante el proceso de solicitud se almacenarán por un período máximo de 2 años desde la última actividad del usuario en la plataforma, tras el cual serán eliminados de forma segura. Los usuarios pueden solicitar la eliminación de sus datos en cualquier momento antes de este plazo.</p>
                                            </section>

                                            <section id="seguridad" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">6. {t('security')}</h3>
                                                <p>EmpleaWorks se compromete a implementar medidas técnicas y organizativas adecuadas para garantizar la seguridad de tus datos personales, incluyendo el uso de cifrado, controles de acceso y auditorías regulares.</p>
                                            </section>

                                            <section id="cookies" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">7. {t('cookies_tracking')}</h3>
                                                <p>Este sitio utiliza cookies y tecnologías similares para mejorar la experiencia del usuario y analizar el uso de la plataforma. Para más información, consulta nuestra <button onClick={() => setActiveTab("cookies")} className="text-primary hover:underline font-medium border-0 bg-transparent p-0 cursor-pointer">Política de Cookies</button>.</p>
                                            </section>

                                            <section id="limitacion-de-responsabilidad" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">8. {t('liability_limitation')}</h3>
                                                <p>EmpleaWorks actúa como intermediario entre candidatos y empresas, y no asume responsabilidad por el contenido de las ofertas publicadas, la veracidad de la información proporcionada por las empresas, o por los procesos de selección realizados por las mismas. Sin embargo, EmpleaWorks se compromete a tomar medidas razonables para verificar la legitimidad de las empresas y las ofertas publicadas.</p>
                                            </section>

                                            <section id="modificaciones" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">9. {t('modifications')}</h3>
                                                <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio. Te notificaremos de cualquier cambio significativo a través de correo electrónico o mediante un aviso en la plataforma.</p>
                                            </section>

                                            <section id="ley-aplicable" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">10. {t('applicable_law')}</h3>
                                                <p>Estos términos y condiciones se rigen por la legislación española y cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales españoles.</p>
                                            </section>

                                            <div className="mt-10 pt-6 border-t border-border">
                                                <p className="text-sm text-muted-foreground">Última actualización: 30 de abril de 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5 z-0" />
                            </TabsContent>

                            {/* Política de Cookies */}
                            <TabsContent value="cookies" className="p-6 md:p-8 relative">
                                <div className="prose dark:prose-invert max-w-none relative z-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Tabla de contenidos - Barra lateral */}
                                        <div className="md:w-64 lg:w-72 shrink-0">
                                            <div className="md:sticky md:top-4">
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border mb-6">
                                                    <h3 className="text-lg font-medium mb-3">{t('table_of_contents')}</h3>
                                                    <nav className="space-y-1 text-sm">
                                                        <a href="#introduccion" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">1. {t('introduction')}</a>
                                                        <a href="#tipos-de-cookies" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">2. {t('cookie_types')}</a>
                                                        <a href="#cookies-de-terceros" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">3. {t('third_party_cookies')}</a>
                                                        <a href="#gestion-de-cookies" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">4. {t('cookie_management')}</a>
                                                        <a href="#privacidad" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">5. {t('privacy_impact')}</a>
                                                        <a href="#actualizaciones" className="block py-1.5 px-2 rounded hover:bg-muted transition-colors">6. {t('updates')}</a>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenido principal */}
                                        <div className="flex-1">
                                            {/* Secciones de la política de cookies */}
                                            <section id="introduccion">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">1. {t('introduction')}</h3>
                                                <p>En EmpleaWorks, utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web, analizar el uso de la plataforma y personalizar el contenido. Esta política explica qué son las cookies, cómo las utilizamos y cómo puedes gestionarlas.</p>
                                            </section>
                                            
                                            {/* Resto de secciones de cookies (sin cambios) */}
                                            <section id="tipos-de-cookies" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">2. {t('cookie_types')}</h3>
                                                <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio. A continuación, se describen los tipos de cookies que utilizamos:</p>
                                                
                                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-lg border border-border bg-card/60">
                                                        <h4 className="font-medium mb-2">Cookies Esenciales</h4>
                                                        <p className="text-sm text-muted-foreground">Son necesarias para el funcionamiento básico del sitio, como la navegación y el acceso a áreas seguras.</p>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-lg border border-border bg-card/60">
                                                        <h4 className="font-medium mb-2">Cookies de Rendimiento</h4>
                                                        <p className="text-sm text-muted-foreground">Nos ayudan a entender cómo los usuarios interactúan con el sitio, proporcionando información sobre las páginas visitadas y los errores encontrados.</p>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-lg border border-border bg-card/60">
                                                        <h4 className="font-medium mb-2">Cookies de Funcionalidad</h4>
                                                        <p className="text-sm text-muted-foreground">Permiten recordar tus preferencias (como el idioma) y personalizar tu experiencia.</p>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-lg border border-border bg-card/60">
                                                        <h4 className="font-medium mb-2">Cookies de Marketing</h4>
                                                        <p className="text-sm text-muted-foreground">Se utilizan para mostrarte anuncios relevantes y medir la efectividad de nuestras campañas publicitarias.</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section id="cookies-de-terceros" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">3. {t('third_party_cookies')}</h3>
                                                <p>EmpleaWorks utiliza servicios de terceros que también pueden establecer cookies en tu dispositivo. Estos incluyen:</p>
                                                <ul className="mt-4 space-y-2">
                                                    <li className="flex items-start gap-2">
                                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Google Analytics</span>: Para analizar el tráfico del sitio y el comportamiento de los usuarios.
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Redes Sociales</span>: Para permitir la integración con plataformas como LinkedIn o Facebook.
                                                        </div>
                                                    </li>
                                                </ul>
                                                <p className="mt-4">Estos terceros tienen sus propias políticas de privacidad y cookies, que puedes consultar en sus respectivos sitios web.</p>
                                            </section>

                                            <section id="gestion-de-cookies" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">4. {t('cookie_management')}</h3>
                                                <p>Puedes aceptar, rechazar o eliminar cookies en cualquier momento a través de la configuración de tu navegador. A continuación, se proporcionan enlaces a las instrucciones para los navegadores más comunes:</p>
                                                
                                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                                                        <span className="text-sm">Chrome</span>
                                                    </a>
                                                    <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
                                                        <span className="text-sm">Firefox</span>
                                                    </a>
                                                    <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path></svg>
                                                        <span className="text-sm">Safari</span>
                                                    </a>
                                                    <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M2 22l.64-3.2a9 9 0 1 1 8.14 0L12 22"></path><path d="M17 22l-5-1-5 1"></path></svg>
                                                        <span className="text-sm">Edge</span>
                                                    </a>
                                                </div>
                                                <p className="mt-4">Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.</p>
                                            </section>

                                            <section id="privacidad" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">5. {t('privacy_impact')}</h3>
                                                <p>Las cookies pueden recopilar información sobre tu comportamiento de navegación, pero en EmpleaWorks nos comprometemos a proteger tu privacidad. No compartimos datos personales con terceros sin tu consentimiento, salvo lo necesario para proporcionar nuestros servicios o cumplir con la ley.</p>
                                                <p className="mt-4">Para más información sobre cómo protegemos tus datos, consulta nuestros <button onClick={() => setActiveTab("terms")} className="text-primary hover:underline font-medium border-0 bg-transparent p-0 cursor-pointer">Términos y Condiciones</button>.</p>
                                            </section>

                                            <section id="actualizaciones" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-primary/90">6. {t('updates')}</h3>
                                                <p>Nos reservamos el derecho de modificar esta política de cookies en cualquier momento. Te notificaremos de cualquier cambio significativo a través de un aviso en el sitio o por correo electrónico.</p>
                                            </section>

                                            <div className="mt-10 pt-6 border-t border-border">
                                                <p className="text-sm text-muted-foreground">Última actualización: 30 de abril de 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5 z-0" />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}