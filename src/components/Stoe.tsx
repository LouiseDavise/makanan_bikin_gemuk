import { useEffect, useState } from 'react'

// Stoe, STOEDIO's pixel mascot (18×17 frames copied from the STOEDIO repo). Tiny PNGs, so Vite inlines them.
const files = import.meta.glob<string>('../assets/stoe/*.png', { eager: true, import: 'default' })
const frame = (name: string) => files[`../assets/stoe/${name}.png`]

export type StoePose = 'front' | 'happy' | 'wow' | 'wave'

/** Decorative. `front` blinks now and then; `wave` alternates the two wave frames. */
export default function Stoe({ pose = 'front', scale = 3, className }: { pose?: StoePose; scale?: number; className?: string }) {
  const [tick, setTick] = useState(false)

  useEffect(() => {
    if (pose === 'wave') {
      const timer = window.setInterval(() => setTick((value) => !value), 260)
      return () => window.clearInterval(timer)
    }
    if (pose !== 'front') return
    let timer: number
    const loop = () => {
      timer = window.setTimeout(() => {
        setTick(true)
        timer = window.setTimeout(() => { setTick(false); loop() }, 140)
      }, 2500 + Math.random() * 3000)
    }
    loop()
    return () => window.clearTimeout(timer)
  }, [pose])

  const name = pose === 'wave' ? (tick ? 'front-wave-2' : 'front-wave-1')
    : pose === 'front' ? (tick ? 'front-blink' : 'front')
    : `front-${pose}`
  return <img className={`stoe${className ? ` ${className}` : ''}`} src={frame(name)} width={18 * scale} height={17 * scale} alt="" aria-hidden="true" draggable={false} />
}
