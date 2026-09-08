import { UserButton } from "@clerk/nextjs"

export default function CustomUserMenu() {
  return (
    <UserButton
      appearance={{
        variables: { colorPrimary: "#2563eb" },
      }}
    />
  )
}