import { useState, useEffect } from "react"

//slideshow images array
const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?w=1920&h=1080&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1573181759662-1c146525b21f?w=1920&h=1080&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1616873354936-b9e21b744c54?w=1920&h=1080&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1627397159237-d2acb7f500af?w=1920&h=1080&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1667849921481-9e13c239ee3d?w=1920&h=1080&fit=crop&auto=format",
]

//function for slideshow
export default function SlideshowBackground() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDESHOW_IMAGES.length),
      5500,
    )
    return () => clearInterval(t)
  }, [])
  return (
    <div className="absolute inset-0">
      {SLIDESHOW_IMAGES.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-slate-700"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1500ms ease",
          }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,15,29,0.60) 0%, rgba(8,15,29,0.76) 60%, rgba(8,15,29,0.84) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, rgba(30,58,95,0.28) 0%, transparent 68%)",
        }}
      />
    </div>
  )
}