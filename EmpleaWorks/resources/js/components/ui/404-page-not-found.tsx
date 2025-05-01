"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { useTranslation } from "@/utils/i18n";

export function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <section className="bg-card dark:bg-card font-sans min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(/storage/app/public/images/404_not_found.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-foreground text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-foreground sm:text-3xl font-bold mb-4">
                {t('page_not_found_title')}
              </h3>
              <p className="mb-6 text-muted-foreground sm:mb-5">
                {t('page_not_found_message')}
              </p>

              <Button
                variant="default"
                className="my-5"
                asChild
              >
                <Link href="/dashboard">{t('back_to_dashboard')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
