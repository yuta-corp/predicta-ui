import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Wordmark } from "@/components/shell/wordmark"

export const metadata = {
  title: "Créer un compte — Predicta",
}

export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
        {/* Wordmark */}
        <div className="mb-10">
          <Wordmark size="lg" />
        </div>

        {/* Auth card */}
        <div className="w-full max-w-[400px]">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-border bg-background/80 backdrop-blur-sm",
                headerTitle: "text-foreground font-semibold text-[17px] tracking-tight",
                headerSubtitle: "text-muted-foreground text-[13px]",
                formFieldLabel: "text-foreground text-[13px] font-medium",
                formFieldInput:
                  "rounded-sm border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20",
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-medium text-[13.5px] shadow-none transition-opacity",
                footerActionLink: "text-primary hover:text-primary/80 text-[13px] font-medium",
                socialButtonsBlockButton:
                  "border-border text-foreground hover:bg-accent/50 rounded-sm text-[13px] font-medium",
                socialButtonsBlockButtonText: "text-foreground font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-[12px]",
                formFieldErrorText: "text-destructive text-[12px]",
                formFieldWarningText: "text-[#e0b25c] text-[12px]",
                identityPreviewEditButton: "text-primary text-[13px]",
                footerAction: "text-muted-foreground text-[12.5px]",
                otpCodeFieldInput:
                  "rounded-sm border-border bg-background text-foreground font-mono",
              },
              variables: {
                colorPrimary: "var(--color-primary, #7fae3f)",
                colorBackground: "var(--color-background, #ffffff)",
                colorInput: "var(--color-foreground, #0b0d09)",
                borderRadius: "0.25rem",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "13.5px",
              },
            }}
            routing="path"
            path="/sign-up"
          />
        </div>

        {/* Footer links */}
        <p className="mt-8 text-center text-[12.5px] text-muted-foreground">
          Déjà un compte ?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Se connecter
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 text-[12px] text-muted-foreground/70 transition-colors hover:text-muted-foreground"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
