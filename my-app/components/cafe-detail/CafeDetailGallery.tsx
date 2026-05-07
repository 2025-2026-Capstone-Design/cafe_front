"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PLACEHOLDER = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop"

const FILL_IMAGES = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop",
]

interface Props {
  imageUrl?: string
  name: string
}

export function CafeDetailGallery({ imageUrl, name }: Props) {
  const mainImage = imageUrl || PLACEHOLDER
  const sideImages = FILL_IMAGES
  const allImages = [mainImage, ...sideImages]
  const [mobileIndex, setMobileIndex] = useState(0)

  return (
    <>
      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[400px] max-w-6xl mx-auto px-4">
        <div className="col-span-2 row-span-2 relative rounded-l-xl overflow-hidden bg-secondary">
          <img src={mainImage} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
        {sideImages.map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden bg-secondary ${i === 1 ? "rounded-tr-xl" : i === 3 ? "rounded-br-xl" : ""}`}
          >
            <img src={img} alt={`${name} ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>

      {/* Mobile: carousel */}
      <div className="md:hidden relative h-[280px] bg-secondary">
        <img src={allImages[mobileIndex]} alt={name} className="w-full h-full object-cover" />
        <button
          onClick={() => setMobileIndex(p => (p - 1 + allImages.length) % allImages.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setMobileIndex(p => (p + 1) % allImages.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
          {mobileIndex + 1} / {allImages.length}
        </div>
      </div>
    </>
  )
}
