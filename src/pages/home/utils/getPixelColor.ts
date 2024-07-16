import { CoordinateType } from '../../../context/blackboardContext'

interface getPixelColorProps {
  currentCoordinate: CoordinateType | null
  imageData: ImageData | null
}

export function getPixelColor({
  currentCoordinate,
  imageData,
}: getPixelColorProps) {
  if (currentCoordinate && imageData) {
    const offset =
      (currentCoordinate.y * imageData.width + currentCoordinate.x) * 4
    if (
      (currentCoordinate.x < 0 ||
        currentCoordinate.y < 0 ||
        currentCoordinate.x > imageData.width,
      currentCoordinate.y > imageData.height)
    ) {
      return [-1, -1, -1, -1]
    } else {
      return [
        imageData.data[offset + 0],
        imageData.data[offset + 1],
        imageData.data[offset + 2],
        imageData.data[offset + 3],
      ]
    }
  }
}
