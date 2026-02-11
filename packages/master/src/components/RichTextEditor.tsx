'use client'

import React from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css' // or 'quill.bubble.css'

const QUILL_COLORS = [
	'#000000',
	'#ff0000',
	'#ff9900',
	'#ffff00',
	'#008a00',
	'#0066cc',
	'#9933ff',
	'#ffffff',
	'#facccc',
	'#ffebcc',
	'#ffffcc',
	'#cce8cc',
	'#cce0f5',
	'#ebd6ff',
	'#bbbbbb',
	'#f06666',
	'#ffc266',
	'#ffff66',
	'#66b966',
	'#66a3e0',
	'#c285ff',
	'#888888',
	'#a10000',
	'#b26b00',
	'#b2b200',
	'#006100',
	'#0047b2',
	'#6b24b2',
	'#444444',
	'#5c0000',
	'#663d00',
	'#666600',
	'#003700',
	'#002966',
	'#3d1466',
]

/*
 * Custom toolbar options
 * For more options, visit https://quilljs.com/docs/modules/toolbar/
 */
const modules = {
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ font: [] }],
		[{ size: ['small', false, 'large', 'huge'] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ color: QUILL_COLORS }],
		[{ background: QUILL_COLORS }],
		[{ script: 'sub' }, { script: 'super' }],
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ align: [] }],
		['blockquote', 'code-block'],
		['link', 'image', 'video'],
		['clean'],
	],
}

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

/**
 * A reusable rich text editor component based on React Quill.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The HTML content for the editor.
 * @param {function(string): void} props.onChange - The callback function that handles content changes.
 * @param {string} [props.placeholder=''] - The placeholder text for the editor.
 * @returns {JSX.Element} The RichTextEditor component.
 */
const RichTextEditor = ({ value, onChange, placeholder = '' }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      modules={modules}
      formats={formats}
      onChange={onChange}
      placeholder={placeholder}
      style={{ backgroundColor: 'white' }} // Example of inline styling
    />
  )
}

export default RichTextEditor
