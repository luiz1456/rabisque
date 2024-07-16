import { ColorTypeRgba } from '../components/blackboard'

export function hexToRgba(hex: string): ColorTypeRgba | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255,
    ]
  } else return null
}
