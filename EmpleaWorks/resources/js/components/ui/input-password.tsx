import React, { useState, useMemo, useEffect } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useTranslation } from "@/utils/i18n";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function InputPassword({
  value,
  onChange,
  label,
  placeholder,
  id = "password",
  required = true,
  name = "password",
  className,
  disabled = false,
}: {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  name?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState(value || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setPassword(value);
    }
  }, [value]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Requisitos alineados con las reglas en Password.php
  const requirements = [
    { regex: /.{8,}/, text: t('password_req_length') },
    { regex: /[A-Z]/, text: t('password_req_uppercase') },
    { regex: /[a-z]/, text: t('password_req_lowercase') },
    { regex: /[0-9]/, text: t('password_req_number') },
  ];

  const strength = useMemo(() => {
    return requirements.map(req => ({
      met: req.regex.test(password),
      text: req.text
    }));
  }, [password]);

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-muted";
    if (score === 1) return "bg-destructive";
    if (score === 2) return "bg-amber-500";
    if (score === 3) return "bg-yellow-500";
    return "bg-emerald-500"; // Todos los requisitos cumplidos (4/4)
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return t('password_enter');
    if (score === 1) return t('password_very_weak');
    if (score === 2) return t('password_weak');
    if (score === 3) return t('password_medium');
    return t('password_strong'); // Todos los requisitos cumplidos (4/4)
  };

  return (
    <div className={className}>
      <div className="space-y-2 w-full">
        <Label htmlFor={id}>{label || t('password')}</Label>
        <div className="relative">
          <Input
            id={id}
            name={name}
            className="pr-9"
            placeholder={placeholder || t('password_placeholder')}
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handleChange}
            required={required}
            autoComplete="new-password"
            disabled={disabled}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? t('password_hide') : t('password_show')}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Indicador de fuerza de contraseña */}
      <div
        className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      {/* Descripción de la fuerza de contraseña */}
      <p className="mb-2 text-sm font-medium">
        {getStrengthText(strengthScore)}
      </p>

      {/* Lista de requisitos de contraseña */}
      <ul className="space-y-1.5">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check
                className="h-4 w-4 text-emerald-500"
              />
            ) : (
              <X
                className="h-4 w-4 text-muted-foreground/70"
              />
            )}
            <span
              className={`text-xs ${
                req.met ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground"
              }`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}