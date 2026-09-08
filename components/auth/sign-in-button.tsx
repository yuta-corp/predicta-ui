import { SignInButton } from "@clerk/nextjs"

export default function CustomSignInButton() {
  return (
    <SignInButton
      mode="modal"
      appearance={{
        variables: { colorPrimary: "#2563eb" },
      }}
    />
  )
}