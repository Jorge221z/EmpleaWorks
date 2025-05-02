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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Link href="/">
                    <AppLogo />
                  </Link>
                </div>
                <h1 className="text-2xl font-bold">{t('welcome_back')}</h1>
                <p className="text-muted-foreground text-balance">
                  {t('enter_email_to_sign_in')}
                </p>
              </div>

              {status && (
                <div className="rounded-md bg-primary/10 p-4 text-sm text-primary">
                  {status}
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  placeholder={t('email_placeholder')}
                  onChange={(e) => setData('email', e.target.value)}
                  autoComplete="username"
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
                  <Label htmlFor="password">{t('password')}</Label>
                  {canResetPassword && (
                    <Link
                      href={route('password.request')}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
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
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  {t('remember_me')}
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={processing}
              >
                {processing ? t('signing_in') : t('sign_in')}
              </Button>
              
              <div className="text-center text-sm">
                {t('dont_have_account')}{" "}
                <Link href={route('register')} className="underline underline-offset-4 hover:text-primary">
                  {t('sign_up')}
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={`/storage/images/login-background.jpg`}
              alt="Login background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground hover:text-primary text-center text-xs text-balance">
        {t('terms_text')}{" "}
        <Link href={route('terms')} className="underline underline-offset-4 hover:text-primary">
          {t('terms_and_conditions')}
        </Link>
      </div>
    </div>
  )
}
