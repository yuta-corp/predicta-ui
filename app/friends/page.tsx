import type { Metadata } from "next"

import { FriendsManager } from "@/components/friends/friends-manager"

export const metadata: Metadata = {
  title: "Mes amis",
  description:
    "Gérez vos amis, vos demandes et le partage de position sur Predicta.",
}

export default function FriendsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Mes amis</h1>
      <FriendsManager />
    </main>
  )
}