import type { AuthErrorCode } from "@/types/auth";

export const AUTH_MESSAGES = {
  loginSuccess: "تم تسجيل الدخول بنجاح",
  sessionExpired: "انتهت الجلسة، سجّل الدخول مرة أخرى",
  unknown: "حدث خطأ غير متوقع، حاول مرة أخرى",
} as const;

export const AUTH_ERRORS: Record<AuthErrorCode, string> = {
  MISSING_FIELDS: "أدخل البريد الإلكتروني وكلمة المرور",
  INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  TOO_MANY_ATTEMPTS: "محاولات كثيرة، حاول مرة أخرى بعد 15 دقيقة",
  SERVER_ERROR: "تعذر تسجيل الدخول حاليًا، حاول لاحقًا",
};
