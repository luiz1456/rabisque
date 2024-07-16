import { CoordinateType } from '../../../context/blackboardContext'
import { ColorTypeRgba } from '../components/blackboard'

interface setPixelColorProps {
  currentCoordinate: CoordinateType | null
  imageData: ImageData | null
  fillColor: ColorTypeRgba | null
}

export function setPixelColor({
  currentCoordinate,
  fillColor,
  imageData,
}: setPixelColorProps) {
  if (!currentCoordinate || !fillColor || !imageData) return
  const offset =
    (currentCoordinate.y * imageData.width + currentCoordinate.x) * 4

  imageData.data[offset + 0] = fillColor[0]
  imageData.data[offset + 1] = fillColor[1]
  imageData.data[offset + 2] = fillColor[2]
  imageData.data[offset + 3] = fillColor[3]
}
