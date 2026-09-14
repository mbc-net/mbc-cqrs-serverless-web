// import '@uiw/react-md-editor/markdown-editor.css'
// import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { cn } from '../../lib/utils'
import * as React from 'react'

interface MDEditorProps {
  className?: string
  value: string
  onChange: (value: string) => void
}

export const MDEditor = ({
  className,
  value,
  onChange,
}: React.PropsWithChildren<MDEditorProps>) => {
  return (
    <div className={cn('markdowneditor-react-container', className)}>
      <MDEditorUIW value={value} onChange={onChange} overflow={false} />
    </div>
  )
}

const MDEditorUIW = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
})
