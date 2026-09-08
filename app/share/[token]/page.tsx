import type { Metadata } from "next"

import { ShareLiveView } from "@/components/share/share-live-view"

export const metadata: Metadata = {
  title: "Position partagée",
  description:
    "Position d'un utilisateur Predicta partagée par lien, consultable en temps réel.",
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <ShareLiveView token={token} />
}