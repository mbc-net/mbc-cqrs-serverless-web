import { cn } from '../lib/utils'
import { X } from 'lucide-react'
import React, {
  cloneElement,
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useMemo,
  useState,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'

interface IModalContext {
  openName: string
  close: () => void
  open: Dispatch<SetStateAction<string>>
}

const ModalContext = createContext<IModalContext | null>(null)

function Modal({ children }) {
  const [openName, setOpenName] = useState('')

  const close = () => setOpenName('')
  const open = setOpenName

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  )
}

function Open({
  children,
  opens: opensWindowName,
}: {
  children: ReactElement
  opens: string
}) {
  const { open } = useContext(ModalContext)!

  return cloneElement(children, { onClick: () => open(opensWindowName) })
}

function Window({ children, name, className, ...props }: any) {
  const { openName, close } = useContext(ModalContext)!
  const nodeRef = useRef(null)

  const [size, setSize] = useState({
    width: 800,
    height: 800,
  })
  const style = useMemo(() => {
    return {
      width: size.width + 'px',
      height: size.height + 'px',
    }
  }, [size])
  const handleResize = (size: { width: number; height: number }) => {
    setSize({
      ...size,
    })
  }

  if (name !== openName) return null

  return createPortal(
    <Draggable
      nodeRef={nodeRef}
      cancel=".react-resizable-handle, .jsoneditor-react-container"
      defaultClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-move z-[1000]"
      positionOffset={{ x: '-50%', y: '-50%' }}
    >
      <div style={style} ref={nodeRef}>
        <ResizableBox
          width={size.width}
          height={size.height}
          handle={
            <div className="react-resizable-handle absolute bottom-0 right-0 m-2 h-4 w-4 cursor-se-resize border-b-4 border-r-4 border-black" />
          }
          onResize={(_, { size }) => handleResize(size)}
          minConstraints={[500, 320]}
        >
          <div
            className={cn(
              'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex h-full w-full flex-col gap-4 overflow-hidden border bg-[hsl(var(--background))] p-6 shadow-lg duration-200 sm:rounded-lg',
              className
            )}
            {...props}
          >
            <button
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
              onClick={close}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="min-h-0 flex-1">
              {cloneElement(children, { onCloseModal: close })}
            </div>
          </div>
        </ResizableBox>
      </div>
    </Draggable>,
    document.body
  )
}

Modal.Open = Open
Modal.Window = Window

export default Modal
