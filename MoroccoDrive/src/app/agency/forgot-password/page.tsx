import { AgencyAuthForm } from "@/modules/auth/components/agency-auth-form";
export default function AgencyForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <AgencyAuthForm mode="forgot" />
    </main>
  );
}
