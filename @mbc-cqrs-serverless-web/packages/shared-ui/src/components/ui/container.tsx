'use client'

import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ContainerProps = Readonly<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>

function Container({ ...rest }: ContainerProps) {
	return <div {...rest} />
}

export { Container }
export type { ContainerProps }
