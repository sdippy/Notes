import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Sparkles, LoaderCircle } from "lucide-react";

import { setAuthTokens } from "@/features/auth/lib/authStorage";
import LayoutMenu from "@/widgets/layout/layout_header";

export default function AuthPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutMenu />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 sm:px-6">
        <div className="flex w-full max-w-112.5 flex-col justify-center gap-8 rounded-xl border border-border-subtle bg-bg-card p-5 sm:p-8">
          <div className="flex items-center justify-center bg-accent-dim rounded-xl size-10">
            <Sparkles size={20} className="text-text-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-[22px] sm:text-[24px]">
              Начните с чистого листа
            </h1>
            <h2 className="text-[14px] text-text-secondary">
              Создайте личное пространство для мыслей, планов и важных идей.
            </h2>
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");

              const formData = new FormData(event.currentTarget);
              const email = formData.get("email");
              const password = formData.get("password");
              const passwordConfirmation = formData.get("passwordConfirmation");

              if (
                typeof email !== "string" ||
                typeof password !== "string" ||
                typeof passwordConfirmation !== "string"
              ) {
                setError("Введите email и пароль.");
                return;
              }

              if (password.length < 8) {
                setError("Пароль должен содержать не менее 8 символов.");
                return;
              }

              if (password !== passwordConfirmation) {
                setError("Пароли не совпадают.");
                return;
              }

              setIsSubmitting(true);

              try {
                const response = await fetch("/api/Auth/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                  throw new Error(
                    response.status === 409
                      ? "Пользователь с таким email уже существует."
                      : "Не удалось создать аккаунт.",
                  );
                }

                const data: { token: string } = await response.json();
                setAuthTokens(data.token);
                navigate("/MainNotes", { replace: true });
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "Произошла ошибка при авторизации.",
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="flex flex-col gap-5 border-b border-border-subtle pb-10"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[14px] font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-xl bg-bg-input pl-3 text-[14px] placeholder:text-text-secondary text-text-primary outline-1 outline-transparent ring-0 focus:ring-0 hover:outline-border-focus focus:outline-border-focus transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[14px] font-medium">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                minLength={8}
                required
                placeholder="Не менее 8 символов"
                className="h-11 rounded-xl bg-bg-input pl-3 text-[14px] placeholder:text-text-secondary text-text-primary outline-1 outline-transparent ring-0 focus:ring-0 hover:outline-border-focus focus:outline-border-focus transition-all duration-200"
              />
              <label
                htmlFor="passwordConfirmation"
                className="text-[12px] text-text-secondary"
              >
                Используйте не менее 8 символов.
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[14px] font-medium">
                Повторите пароль
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                minLength={8}
                required
                placeholder="Повторите пароль"
                className="h-11 rounded-xl bg-bg-input pl-3 text-[14px] placeholder:text-text-secondary text-text-primary outline-1 outline-transparent ring-0 focus:ring-0 hover:outline-border-focus focus:outline-border-focus transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center bg-accent text-bg-main text-[16px] font-semibold px-5 h-11 rounded-xl hover:bg-accent-dim hover:text-text-primary transition-colors duration-200 cursor-pointer"
            >
              {isSubmitting ? (
                <LoaderCircle
                  size="20"
                  className="text-text-primary animate-spin"
                />
              ) : (
                "Создать аккаунт 🡢"
              )}
            </button>
          </form>

          <p
            className={`text-sm text-accent text-center h-2 transition-opacity duration-200 ${
              error ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {error || ""}{" "}
          </p>
          <NavLink
            to=""
            className="text-[12px] text-text-secondary text-center hover:text-text-primary cursor-pointer transition-all duration-200"
          >
            Создавая аккаунт, вы принимаете условия использования и политику
            конфиденциальности.
          </NavLink>
        </div>
      </div>
    </div>
  );
}
