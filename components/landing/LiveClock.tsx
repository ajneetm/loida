'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LiveClock({ size = 380 }: { size?: number }) {
  const [angles, setAngles] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    function tick() {
      const d = new Date()
      const s = d.getSeconds()
      const m = d.getMinutes()
      const h = d.getHours() % 12
      setAngles({
        h: h * 30 + m * 0.5,
        m: m * 6 + s * 0.1,
        s: s * 6,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Clock face */}
      <Image src="/images/clock-bg.svg" alt="" fill className="object-contain" />

      {/* Hour hand */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `rotate(${angles.h}deg)`,
        transition: 'transform 0.5s ease',
      }}>
        <Image src="/images/clock-hour.svg" alt="" fill className="object-contain" />
      </div>

      {/* Minute hand */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `rotate(${angles.m}deg)`,
        transition: 'transform 0.5s ease',
      }}>
        <Image src="/images/clock-minute.svg" alt="" fill className="object-contain" />
      </div>

      {/* Second hand */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `rotate(${angles.s}deg)`,
        transition: 'transform 0.2s ease',
      }}>
        <Image src="/images/clock-second.svg" alt="" fill className="object-contain" />
      </div>
    </div>
  )
}
