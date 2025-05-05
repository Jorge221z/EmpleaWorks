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
                    <h2 className="text-3xl font-semibold mb-2 text-[#7c28eb]">
                        {activeTab === "terms" ? t('terms_title') : t('cookies_title')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {activeTab === "terms" ? t('terms_subtitle') : t('cookies_subtitle')}
                    </p>

                    <div className="bg-card border border-purple-100 dark:border-purple-600/30 rounded-xl overflow-hidden">
                        <div className="border-b border-purple-100 dark:border-purple-600/30 p-1 bg-purple-50/50 dark:bg-purple-950/20">
                            <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent">
                                    <TabsTrigger 
                                        value="terms"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-[#7c28eb] data-[state=active]:shadow-sm"
                                    >
                                        {t('terms_and_conditions')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="cookies"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-[#7c28eb] data-[state=active]:shadow-sm"
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
                                                <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-600/30 mb-6">
                                                    <h3 className="text-lg font-medium mb-3 text-[#9645f4] dark:text-[#c79dff]">{t('table_of_contents')}</h3>
                                                    <nav className="space-y-1 text-sm">
                                                        <a href="#terminos-de-uso" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">1. {t('terms_of_use')}</a>
                                                        <a href="#proteccion-de-datos" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">2. {t('data_protection')}</a>
                                                        <a href="#uso-de-la-informacion" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">3. {t('use_of_information')}</a>
                                                        <a href="#derechos-rgpd" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">4. {t('gdpr_rights')}</a>
                                                        <a href="#retencion-de-datos" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">5. {t('data_retention')}</a>
                                                        <a href="#seguridad" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">6. {t('security')}</a>
                                                        <a href="#cookies" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">7. {t('cookies_tracking')}</a>
                                                        <a href="#limitacion-de-responsabilidad" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">8. {t('liability_limitation')}</a>
                                                        <a href="#modificaciones" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">9. {t('modifications')}</a>
                                                        <a href="#ley-aplicable" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">10. {t('applicable_law')}</a>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenido principal */}
                                        <div className="flex-1">
                                            {/* Secciones de términos y condiciones */}
                                            <section id="terminos-de-uso">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">1. {t('terms_of_use')}</h3>
                                                <p>{t('terms_of_use_text')}</p>
                                            </section>

                                            <section id="proteccion-de-datos" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">2. {t('data_protection')}</h3>
                                                <p>{t('data_protection_text')}</p>
                                            </section>
                                            
                                            <section id="uso-de-la-informacion" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">3. {t('use_of_information')}</h3>
                                                <p>{t('use_of_information_text')}</p>
                                            </section>

                                            <section id="derechos-rgpd" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">4. {t('gdpr_rights')}</h3>
                                                <p>{t('gdpr_rights_text')}</p>
                                            </section>

                                            <section id="retencion-de-datos" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">5. {t('data_retention')}</h3>
                                                <p>{t('data_retention_text')}</p>
                                            </section>

                                            <section id="seguridad" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">6. {t('security')}</h3>
                                                <p>{t('security_text')}</p>
                                            </section>

                                            <section id="cookies" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">7. {t('cookies_tracking')}</h3>
                                                <p>
                                                    {t('cookies_tracking_text', {
                                                        cookies_policy: (
                                                            <button onClick={() => setActiveTab("cookies")} className="text-[#7c28eb] hover:underline font-medium border-0 bg-transparent p-0 cursor-pointer">
                                                                {t('cookies_policy')}
                                                            </button>
                                                        )
                                                    })}
                                                </p>
                                            </section>

                                            <section id="limitacion-de-responsabilidad" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">8. {t('liability_limitation')}</h3>
                                                <p>{t('liability_limitation_text')}</p>
                                            </section>

                                            <section id="modificaciones" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">9. {t('modifications')}</h3>
                                                <p>{t('modifications_text')}</p>
                                            </section>

                                            <section id="ley-aplicable" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">10. {t('applicable_law')}</h3>
                                                <p>{t('applicable_law_text')}</p>
                                            </section>

                                            <div className="mt-10 pt-6 border-t border-purple-100 dark:border-purple-600/30">
                                                <p className="text-sm text-muted-foreground">{t('last_update', { date: '30 de abril de 2025' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-purple-900/5 dark:stroke-purple-100/5 z-0" />
                            </TabsContent>

                            {/* Política de Cookies */}
                            <TabsContent value="cookies" className="p-6 md:p-8 relative">
                                <div className="prose dark:prose-invert max-w-none relative z-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Tabla de contenidos - Barra lateral */}
                                        <div className="md:w-64 lg:w-72 shrink-0">
                                            <div className="md:sticky md:top-4">
                                                <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-600/30 mb-6">
                                                    <h3 className="text-lg font-medium mb-3 text-[#9645f4] dark:text-[#c79dff]">{t('table_of_contents')}</h3>
                                                    <nav className="space-y-1 text-sm">
                                                        <a href="#introduccion" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">1. {t('introduction')}</a>
                                                        <a href="#tipos-de-cookies" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">2. {t('cookie_types')}</a>
                                                        <a href="#cookies-de-terceros" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">3. {t('third_party_cookies')}</a>
                                                        <a href="#gestion-de-cookies" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">4. {t('cookie_management')}</a>
                                                        <a href="#privacidad" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">5. {t('privacy_impact')}</a>
                                                        <a href="#actualizaciones" className="block py-1.5 px-2 rounded hover:bg-purple-100/70 dark:hover:bg-purple-900/30 hover:text-[#7c28eb] transition-colors">6. {t('updates')}</a>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenido principal */}
                                        <div className="flex-1">
                                            {/* Secciones de la política de cookies */}
                                            <section id="introduccion">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">1. {t('introduction')}</h3>
                                                <p>{t('introduction_text')}</p>
                                            </section>
                                            
                                            <section id="tipos-de-cookies" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">2. {t('cookie_types')}</h3>
                                                <p>{t('cookie_types_text')}</p>
                                                
                                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-lg border border-purple-100 dark:border-purple-600/30 bg-white/70 dark:bg-gray-900/70">
                                                        <h4 className="font-medium mb-2 text-[#9645f4] dark:text-[#c79dff]">{t('essential_cookies')}</h4>
                                                        <p className="text-sm text-muted-foreground">{t('essential_cookies_text')}</p>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-lg border border-purple-100 dark:border-purple-600/30 bg-white/70 dark:bg-gray-900/70">
                                                        <h4 className="font-medium mb-2 text-[#9645f4] dark:text-[#c79dff]">{t('performance_cookies')}</h4>
                                                        <p className="text-sm text-muted-foreground">{t('performance_cookies_text')}</p>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-lg border border-purple-100 dark:border-purple-600/30 bg-white/70 dark:bg-gray-900/70">
                                                        <h4 className="font-medium mb-2 text-[#9645f4] dark:text-[#c79dff]">{t('functionality_cookies')}</h4>
                                                        <p className="text-sm text-muted-foreground">{t('functionality_cookies_text')}</p>
                                                    </div>
                                                    
                                                    <div className="p-4 rounded-lg border border-purple-100 dark:border-purple-600/30 bg-white/70 dark:bg-gray-900/70">
                                                        <h4 className="font-medium mb-2 text-[#9645f4] dark:text-[#c79dff]">{t('marketing_cookies')}</h4>
                                                        <p className="text-sm text-muted-foreground">{t('marketing_cookies_text')}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section id="cookies-de-terceros" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">3. {t('third_party_cookies')}</h3>
                                                <p>{t('third_party_cookies_text')}</p>
                                                <ul className="mt-4 space-y-2">
                                                    <li className="flex items-start gap-2">
                                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1 mt-0.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c28eb]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-[#9645f4] dark:text-[#c79dff]">Google Analytics</span>: {t('third_party_cookies_ga')}
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1 mt-0.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c28eb]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-[#9645f4] dark:text-[#c79dff]">{t('third_party_cookies_social')}</span>: {t('third_party_cookies_social_text')}
                                                        </div>
                                                    </li>
                                                </ul>
                                                <p className="mt-4">{t('third_party_cookies_note')}</p>
                                            </section>

                                            <section id="gestion-de-cookies" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">4. {t('cookie_management')}</h3>
                                                <p>{t('cookie_management_text')}</p>
                                                
                                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-purple-100 dark:border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-center group">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                                                        <span className="text-sm group-hover:text-[#7c28eb]">Chrome</span>
                                                    </a>
                                                    <a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-purple-100 dark:border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-center group">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
                                                        <span className="text-sm group-hover:text-[#7c28eb]">Firefox</span>
                                                    </a>
                                                    <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-purple-100 dark:border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-center group">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path></svg>
                                                        <span className="text-sm group-hover:text-[#7c28eb]">Safari</span>
                                                    </a>
                                                    <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 rounded-lg border border-purple-100 dark:border-purple-600/30 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-center group">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-[#9645f4] dark:text-[#c79dff] group-hover:text-[#7c28eb]"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>
                                                        <span className="text-sm group-hover:text-[#7c28eb]">Edge</span>
                                                    </a>
                                                </div>
                                                <p className="mt-4">{t('cookie_management_note')}</p>
                                            </section>

                                            <section id="privacidad" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">5. {t('privacy_impact')}</h3>
                                                <p>{t('privacy_impact_text')}</p>
                                                <p className="mt-4">
                                                    {t('privacy_impact_more', {
                                                        terms_and_conditions: (
                                                            <button onClick={() => setActiveTab("terms")} className="text-[#7c28eb] hover:underline font-medium border-0 bg-transparent p-0 cursor-pointer">
                                                                {t('terms_and_conditions')}
                                                            </button>
                                                        )
                                                    })}
                                                </p>
                                            </section>

                                            <section id="actualizaciones" className="mt-8">
                                                <h3 className="text-xl font-semibold mb-3 text-[#7c28eb]">6. {t('updates')}</h3>
                                                <p>{t('updates_text')}</p>
                                            </section>

                                            <div className="mt-10 pt-6 border-t border-purple-100 dark:border-purple-600/30">
                                                <p className="text-sm text-muted-foreground">{t('last_update', { date: '30 de abril de 2025' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-purple-900/5 dark:stroke-purple-100/5 z-0" />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}