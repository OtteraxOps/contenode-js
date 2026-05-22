export type Mark =
	| { type: 'bold' }
	| { type: 'italic' }
	| { type: 'strike' }
	| { type: 'code' }

export type InlineContent =
	| { type: 'text'; text: string; marks?: Mark[] }
	| { type: 'link'; href: string; content: InlineContent[] }

export type TableRow = {
	isHeader: boolean
	cells: InlineContent[][]
}

export type Block =
	| { type: 'paragraph'; content: InlineContent[] }
	| { type: 'heading'; level: 1 | 2 | 3; content: InlineContent[] }
	| { type: 'bulletList'; items: InlineContent[][] }
	| { type: 'orderedList'; items: InlineContent[][] }
	| { type: 'blockquote'; content: InlineContent[] }
	| { type: 'codeBlock'; language: string | null; code: string }
	| { type: 'image'; src: string; alt: string | null; caption: string | null }
	| { type: 'table'; rows: TableRow[] }
	| { type: 'divider' }
