import { useEffect } from "react"
import { useForm, Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/utils/i18n"
import AppLogo from "@/components/app-logo"

export function LoginForm({
  className,
  status,
  canResetPassword = true,
  ...props
}: React.ComponentProps<"div"> & { 
  status?: string; 
  canResetPassword?: boolean;
}) {
  const { t } = useTranslation();
  
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-purple-100 dark:border-purple-600/30">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Link href="/">
                    <AppLogo className="h-12 w-12" />
                  </Link>
                </div>
                <h1 className="text-2xl font-bold text-[#7c28eb]">{t('welcome_back')}</h1>
                <p className="text-muted-foreground text-balance">
                  {t('enter_email_to_sign_in')}
                </p>
              </div>

              {status && (
                <div className="rounded-md bg-purple-100 dark:bg-purple-900/20 p-4 text-sm text-[#7c28eb] dark:text-purple-300">
                  {status}
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-[#9645f4] dark:text-[#c79dff]">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  placeholder={t('email_placeholder')}
                  onChange={(e) => setData('email', e.target.value)}
                  autoComplete="username"
                  className="border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
                  required
                />
                {errors.email && (
                  <div className="text-sm text-destructive">
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-[#9645f4] dark:text-[#c79dff]">{t('password')}</Label>
                  {canResetPassword && (
                    <Link
                      href={route('password.request')}
                      className="ml-auto text-sm text-[#9645f4] dark:text-[#c79dff] underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300 hover:underline"
                    >
                      {t('forgot_your_password')}
                    </Link>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  autoComplete="current-password"
                  placeholder={t('password_placeholder')}
                  className="border-purple-100 dark:border-purple-600/30 focus-visible:ring-[#7c28eb]"
                  required 
                />
                {errors.password && (
                  <div className="text-sm text-destructive">
                    {errors.password}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) => 
                    setData('remember', checked === true)
                  }
                  className="border-purple-200 dark:border-purple-700 data-[state=checked]:bg-[#7c28eb] data-[state=checked]:border-[#7c28eb]"
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  {t('remember_me')}
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#7c28eb] hover:bg-[#6620c5] dark:bg-[#7c28eb] dark:hover:bg-[#9645f4] text-white"
                disabled={processing}
              >
                {processing ? t('signing_in') : t('sign_in')}
              </Button>
              
              <div className="text-center text-sm">
                {t('dont_have_account')}{" "}
                <Link href={route('register')} className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300">
                  {t('sign_up')}
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/login-background.png"
              alt="Login background"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground hover:text-[#7c28eb] text-center text-xs text-balance">
        {t('terms_text')}{" "}
        <Link href={route('terms')} className="text-[#9645f4] dark:text-[#c79dff] underline underline-offset-4 hover:text-[#7c28eb] dark:hover:text-purple-300">
          {t('terms_and_conditions')}
        </Link>
      </div>
    </div>
  )
}
