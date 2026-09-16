import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Lock, LoaderCircle } from "lucide-react";

import { setAuthTokens } from "../auth/authStorage";
import LayoutMenu from "../components/Layout/layout_header";

export default function AuthPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <LayoutMenu />
      <div className="flex flex-col gap-4 justify-center items-center h-full">
        <div className="w-112.5 flex flex-col gap-8 justify-center p-8 rounded-xl bg-bg-card border border-border-subtle">
          <div className="flex items-center justify-center bg-accent-dim rounded-xl size-10">
            <Lock size={20} className="text-text-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-[24px]">С возвращением</h1>
            <h2 className="text-[14px] text-text-secondary">
              Войдите, чтобы продолжить работу со своими заметками.
            </h2>
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");

              const formData = new FormData(event.currentTarget);
              const email = formData.get("email");
              const password = formData.get("password");

              if (typeof email !== "string" || typeof password !== "string") {
                setError("Введите email и пароль.");
                return;
              }

              setIsSubmitting(true);

              try {
                const response = await fetch("/api/Auth/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                  throw new Error(
                    "Не удалось войти. Проверьте email и пароль.",
                  );
                }

                const data: { token: string; refreshToken: string } =
                  await response.json();
                setAuthTokens(data.token, data.refreshToken);
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
                placeholder="Введите пароль"
                className="h-11 rounded-xl bg-bg-input pl-3 text-[14px] placeholder:text-text-secondary text-text-primary outline-1 outline-transparent ring-0 focus:ring-0 hover:outline-border-focus focus:outline-border-focus transition-all duration-200"
              />
            </div>

            <div className="flex gap-1.5 items-center">
              <input className="accent-accent translate-y-px" type="checkbox" />
              <span className="text-text-secondary text-[14px]">
                Запомнить меня
              </span>
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
                "Войти 🡢"
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

          <div className="flex text-[14px] gap-1 justify-center">
            <span className="text-text-secondary">Нет аккаунта?</span>
            <NavLink
              to="/register"
              className="text-accent border-b border-transparent hover:border-accent cursor-pointer font-medium"
            >
              Зарегистрироваться
            </NavLink>
          </div>
        </div>
        <span className="text-[12px] text-text-secondary">
          Ваши заметки видны только вам.
        </span>
      </div>
    </div>
  );
}
