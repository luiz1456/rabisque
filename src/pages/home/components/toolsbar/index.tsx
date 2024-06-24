// import { useContext } from 'react'
// import { blackboardContext } from '../../../../context/blackboardContext'
import {
  IoAnalytics,
  IoArrowUndoOutline,
  IoPencil,
  IoTrashOutline,
} from 'react-icons/io5'
import { LuCircle, LuEraser, LuRuler, LuSquare } from 'react-icons/lu'
import { ToolsbarStyled } from './styles'
import { toolsbarContext } from '../../../../context/toolsbarContext'
import { useContext } from 'react'
import { blackboardContext } from '../../../../context/blackboardContext'
import { MdArrowLeft } from 'react-icons/md'
import { IoMdColorFill } from 'react-icons/io'
// import { toolsbarContext } from '../../../../context/toolsbarContext'

interface ToolsbarProps {
  drawingLayerContext: CanvasRenderingContext2D | null
}

export function Toolsbar({ drawingLayerContext }: ToolsbarProps) {
  // export function Toolsbar({ canvasContext }: ToolsbarProps) {
  const { blackboardSize } = useContext(blackboardContext)
  const {
    setLineColor,
    setBackgroundColor,
    activeTool,
    setActiveTool,
    setLineWidth,
    lineWidth,
    restoreArray,
    setRestoreArray,
  } = useContext(toolsbarContext)

  function clearDraw() {
    if (blackboardSize) {
      const { width, height } = blackboardSize
      drawingLayerContext?.clearRect(0, 0, width, height)
      setRestoreArray([])
    }
  }

  function unmake() {
    const restoreArrayAtt = restoreArray.filter(
      (_, i) => i !== restoreArray.length - 1,
    )
    setRestoreArray(restoreArrayAtt)
    if (restoreArray.length > 1) {
      const imageData = restoreArrayAtt[restoreArrayAtt.length - 1]
      drawingLayerContext?.putImageData(imageData, 0, 0)
    } else {
      clearDraw()
    }
  }

  return (
    <ToolsbarStyled>
      <div className="containerInputRange">
        {/* <span>{`100%`}</span> */}
        <span>{`${lineWidth}%`}</span>
        <input
          type="range"
          value={lineWidth}
          onChange={
            setLineWidth
              ? (event) => setLineWidth(event.target.value)
              : () => {}
          }
          min={1}
        />
        <span>Traço</span>
      </div>
      <div className="containerInputColor">
        <input
          type="color"
          onInput={(event) => {
            const InputElement = event.target as HTMLInputElement
            setLineColor(InputElement.value)
          }}
        />
        <span>Cor</span>
      </div>
      <div className="containerInputColor">
        <input
          type="color"
          defaultValue={'#ffffff'}
          onChange={(event) => {
            setBackgroundColor(event.target.value)
          }}
        />
        <span>Cor de fundo</span>
      </div>
      <button
        className={activeTool === 'line' ? 'active' : ''}
        onClick={() => {
          setActiveTool('line')
        }}
      >
        <IoPencil />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button
        className={activeTool === 'eraser' ? 'active' : ''}
        onClick={() => {
          setActiveTool('eraser')
        }}
      >
        <LuEraser />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button
        className={activeTool === 'square' ? 'active' : ''}
        onClick={() => {
          setActiveTool('square')
        }}
      >
        <LuSquare />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button
        className={activeTool === 'straightLine' ? 'active' : ''}
        onClick={() => {
          setActiveTool('straightLine')
        }}
      >
        <LuRuler />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button
        className={activeTool === 'circle' ? 'active' : ''}
        onClick={() => {
          setActiveTool('circle')
        }}
      >
        <LuCircle />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button
        className={activeTool === 'lineWithDots' ? 'active' : ''}
        onClick={() => {
          setActiveTool('lineWithDots')
        }}
      >
        <IoAnalytics />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button
        className={activeTool === 'fill' ? 'active' : ''}
        onClick={() => {
          setActiveTool('fill')
        }}
      >
        <IoMdColorFill />
        <MdArrowLeft className="arrowleft" />
      </button>
      <button onClick={unmake} className="arrowUndo">
        <IoArrowUndoOutline />
      </button>
      <button onClick={clearDraw} className="trash">
        <IoTrashOutline />
      </button>
    </ToolsbarStyled>
  )
}
