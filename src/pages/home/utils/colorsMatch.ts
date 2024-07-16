import { ColorTypeRgba } from '../components/blackboard'

export function colorsMatch(
  color1: ColorTypeRgba,
  color2: ColorTypeRgba | null,
) {
  return (
    color1[0] === color2![0] &&
    color1[1] === color2![1] &&
    color1[2] === color2![2] &&
    color1[3] === color2![3]
  )
}
