import dynamic from "next/dynamic"
const TrafficMap = dynamic(() => import("@/components/traffic-map"), { ssr: false })
export default function Page() {
  return <TrafficMap />
}
