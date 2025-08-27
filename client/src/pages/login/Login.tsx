
import { LoginForm } from "@/components/features/login/LoginForm"
import { ModeToggle } from "@/components/mode-toggle"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
