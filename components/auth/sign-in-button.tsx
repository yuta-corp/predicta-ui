import { SignInButton } from "@clerk/nextjs"
import { LogIn } from "lucide-react"

export default function CustomSignInButton() {
  return (
    <SignInButton
      mode="modal"
      appearance={{
        variables: { colorPrimary: "#9ccf3c", borderRadius: "0.5rem" },
      }}
    >
      <button
        type="button"
        className="group inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-[translate,background-color,box-shadow] hover:opacity-90 active:translate-y-px"
      >
        Se connecter
        <LogIn
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          aria-hidden
        />
      </button>
    </SignInButton>
  )
}