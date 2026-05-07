"use client"

import { ComponentType } from "react"
import { useRouter } from "next/navigation"
import { Coffee, Cake, Sparkles, Sofa, Snowflake, Wheat, Tag, Users } from "lucide-react"
import { AspectKey, ASPECT_LABELS } from "@/lib/types"

const CATEGORIES: { key: AspectKey; icon: ComponentType<{ className?: string }>; color: string }[] = [
  { key: "coffee",  icon: Coffee,    color: "bg-amber-100 text-amber-700" },
  { key: "bakery",  icon: Wheat,     color: "bg-orange-100 text-orange-700" },
  { key: "cake",    icon: Cake,      color: "bg-pink-100 text-pink-700" },
  { key: "bingsu",  icon: Snowflake, color: "bg-sky-100 text-sky-700" },
  { key: "space",   icon: Sofa,      color: "bg-violet-100 text-violet-700" },
  { key: "vibe",    icon: Sparkles,  color: "bg-yellow-100 text-yellow-700" },
  { key: "price",   icon: Tag,       color: "bg-emerald-100 text-emerald-700" },
  { key: "service", icon: Users,     color: "bg-blue-100 text-blue-700" },
]

export function HomeCategorySection() {
  const router = useRouter()

  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {CATEGORIES.map(({ key, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => router.push(`/search?aspect=${key}`)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-colors group"
            >
              <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {ASPECT_LABELS[key].split("/")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
