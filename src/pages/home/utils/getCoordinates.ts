import { TypeEventMouseOrTouch } from '../components/blackboard'

interface GetCoordinateProps {
  blackboardRef: React.RefObject<HTMLDivElement>
  event: TypeEventMouseOrTouch
}

export function getCoordinate({ blackboardRef, event }: GetCoordinateProps) {
  if (blackboardRef.current) {
    const positionElement = blackboardRef.current.getBoundingClientRect()
    const coordinate = {
      x:
        'changedTouches' in event
          ? Math.round(event.changedTouches[0].clientX - positionElement.left)
          : event.clientX - positionElement.left,
      y:
        'changedTouches' in event
          ? Math.round(event.changedTouches[0].clientY - positionElement.top)
          : event.clientY - positionElement.top,
    }
    return coordinate
  } else {
    return null
  }
}
