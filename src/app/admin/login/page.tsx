import { PinkyLogo } from "@/components/pinky-logo";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-card p-8">
        <div className="mb-6 flex items-center gap-2">
          <PinkyLogo subtext={false} />
          <span className="text-[10px] font-bold uppercase leading-none text-white/50">
            Admin
          </span>
        </div>
        <h1 className="mb-1 text-xl font-bold text-white">Ingresá al panel</h1>
        <p className="mb-6 text-sm text-white/50">
          Administrá las secciones y proyectos del sitio.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
