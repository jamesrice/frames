import type { IconName } from '../data/world'

interface IconProps {
  name: IconName
  className?: string
}

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

function rays(innerR: number, outerR: number) {
  return RAY_ANGLES.map((deg) => {
    const rad = (deg * Math.PI) / 180
    const x1 = 12 + innerR * Math.cos(rad)
    const y1 = 12 + innerR * Math.sin(rad)
    const x2 = 12 + outerR * Math.cos(rad)
    const y2 = 12 + outerR * Math.sin(rad)
    return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />
  })
}

function frame(size: number) {
  const offset = (24 - size) / 2
  return <rect x={offset} y={offset} width={size} height={size} rx={1.5} />
}

function aperture(holeR: number) {
  return (
    <>
      <circle cx={12} cy={12} r={9} />
      <circle cx={12} cy={12} r={holeR} />
    </>
  )
}

function camera(lensR: number, humpWidth: number, humpHeight: number, bodyY: number, bodyHeight: number) {
  return (
    <>
      <rect x={3} y={bodyY} width={18} height={bodyHeight} rx={2} />
      <rect x={12 - humpWidth / 2} y={bodyY - humpHeight + 1} width={humpWidth} height={humpHeight} rx={1} />
      <circle cx={12} cy={bodyY + bodyHeight / 2} r={lensR} />
    </>
  )
}

function filmStrip(filled: boolean) {
  return (
    <>
      <rect x={3} y={5} width={18} height={14} rx={1.5} />
      <rect x={5.5} y={6.5} width={1.5} height={1.5} />
      <rect x={10.25} y={6.5} width={1.5} height={1.5} />
      <rect x={15} y={6.5} width={1.5} height={1.5} />
      <rect x={5.5} y={16} width={1.5} height={1.5} />
      <rect x={10.25} y={16} width={1.5} height={1.5} />
      <rect x={15} y={16} width={1.5} height={1.5} />
      <circle cx={12} cy={12} r={2.25} fill={filled ? 'currentColor' : 'none'} />
    </>
  )
}

function iconPaths(name: IconName) {
  switch (name) {
    case 'sun':
      return (
        <>
          <circle cx={12} cy={12} r={4} />
          {rays(6, 9)}
        </>
      )
    case 'sun-hard':
      return (
        <>
          <circle cx={12} cy={12} r={3.5} fill="currentColor" />
          {rays(6, 8.5)}
        </>
      )
    case 'moon':
      return <path d="M15 3a9 9 0 1 0 0 18 7 7 0 1 1 0-18Z" />
    case 'cloud':
      return <path d="M7 18a4 4 0 1 1 .9-7.9A5 5 0 1 1 17 10h.5a3.5 3.5 0 1 1 0 8H7Z" />
    case 'bolt':
      return <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor" />
    case 'window':
      return (
        <>
          <rect x={4} y={3} width={16} height={18} rx={1.5} />
          <line x1={12} y1={3} x2={12} y2={21} />
          <line x1={4} y1={12} x2={20} y2={12} />
        </>
      )
    case 'bulb':
      return (
        <>
          <circle cx={12} cy={10} r={6} />
          <line x1={9} y1={16} x2={9} y2={19} />
          <line x1={15} y1={16} x2={15} y2={19} />
          <line x1={9} y1={19} x2={15} y2={19} />
        </>
      )
    case 'arrow-right':
      return (
        <>
          <line x1={4} y1={12} x2={18} y2={12} />
          <path d="M13 7l5 5-5 5" />
        </>
      )
    case 'arrow-diagonal':
      return (
        <>
          <line x1={5} y1={19} x2={19} y2={5} />
          <path d="M12 5h7v7" />
        </>
      )
    case 'circle-half':
      return (
        <>
          <circle cx={12} cy={12} r={8} />
          <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
        </>
      )
    case 'arrow-up':
      return (
        <>
          <line x1={12} y1={19} x2={12} y2={5} />
          <path d="M7 10l5-5 5 5" />
        </>
      )
    case 'arrow-down':
      return (
        <>
          <line x1={12} y1={5} x2={12} y2={19} />
          <path d="M7 14l5 5 5-5" />
        </>
      )
    case 'tilt':
      return <rect x={7} y={7} width={10} height={10} rx={1.5} transform="rotate(15 12 12)" />
    case 'frame-1':
      return frame(8)
    case 'frame-2':
      return frame(11)
    case 'frame-3':
      return frame(14)
    case 'frame-4':
      return frame(18)
    case 'person':
      return (
        <>
          <circle cx={12} cy={8} r={3} />
          <path d="M6 20c0-4 3-6 6-6s6 2 6 6" />
        </>
      )
    case 'frame-wide':
      return (
        <>
          <rect x={2} y={7} width={20} height={10} rx={1.5} />
          <circle cx={12} cy={12} r={1.5} fill="currentColor" />
        </>
      )
    case 'film-color':
      return filmStrip(true)
    case 'film-bw':
      return filmStrip(false)
    case 'camera-rangefinder':
      return camera(3, 4, 2.5, 8, 10)
    case 'camera-slr':
      return camera(3.5, 6, 3.5, 9, 10)
    case 'camera-mf':
      return camera(4.5, 9, 2, 6, 14)
    case 'aperture-1':
      return aperture(7)
    case 'aperture-2':
      return aperture(5.5)
    case 'aperture-3':
      return aperture(4)
    case 'aperture-4':
      return aperture(2)
    default:
      return null
  }
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths(name)}
    </svg>
  )
}
