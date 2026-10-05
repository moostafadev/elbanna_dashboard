"use client";

import React, { memo, useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { login } from "@/actions/auth.actions";
import { AUTH_ERRORS, AUTH_MESSAGES } from "./constants";

const LoginForm = ({ redirectTo }: { redirectTo: string }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isPending || success) return;

      setError("");

      startTransition(async () => {
        const res = await login({ email, password });

        if (!res.success) {
          setError(AUTH_ERRORS[res.error] ?? AUTH_MESSAGES.unknown);
          return;
        }

        setSuccess(true);
        toast({ title: AUTH_MESSAGES.loginSuccess });
        router.replace(redirectTo);
        router.refresh();
      });
    },
    [email, password, isPending, success, redirectTo, router],
  );

  const busy = isPending || success;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email">البريد الإلكتروني</Label>
        <Input
          id="login-email"
          type="email"
          dir="ltr"
          autoComplete="username"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          placeholder="admin@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">كلمة المرور</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            aria-label={
              showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            }
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-gray-500"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={busy} className="w-full gap-2 text-white">
        {busy ? <Loader2 className="animate-spin" /> : <LogIn />}
        {busy ? "جاري الدخول..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
};

export default memo(LoginForm);
