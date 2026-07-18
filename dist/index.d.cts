interface VoltpressConfig {
    apiUrl: string;
    clientId: string;
    clientSecret: string;
}
declare function createVoltpress(config: VoltpressConfig): {
    collection<T = Record<string, unknown>>(slug: string): {
        list(input?: ICollectionListInput): Promise<ICollectionListOutput<T>>;
        find(entrySlug: string, input?: ICollectionFindInput): Promise<IVoltpressCollectionEntry<T>>;
    };
    global<T = Record<string, unknown>>(slug: string): {
        get(input?: IGlobalGetInput): Promise<IGlobalGetOutput<T>>;
    };
};

interface IVoltpressApiResponse<T> {
    message: string;
    data: T;
}

type Mark = {
    type: 'bold';
} | {
    type: 'italic';
} | {
    type: 'strike';
} | {
    type: 'code';
};
type InlineContent = {
    type: 'text';
    text: string;
    marks?: Mark[];
} | {
    type: 'link';
    href: string;
    content: InlineContent[];
};
type TableRow = {
    isHeader: boolean;
    cells: InlineContent[][];
};
type Block = {
    type: 'paragraph';
    content: InlineContent[];
} | {
    type: 'heading';
    level: 1 | 2 | 3;
    content: InlineContent[];
} | {
    type: 'bulletList';
    items: InlineContent[][];
} | {
    type: 'orderedList';
    items: InlineContent[][];
} | {
    type: 'blockquote';
    content: InlineContent[];
} | {
    type: 'codeBlock';
    language: string | null;
    code: string;
} | {
    type: 'image';
    src: string;
    alt: string | null;
    caption: string | null;
} | {
    type: 'table';
    rows: TableRow[];
} | {
    type: 'divider';
};

interface IVoltpressCollectionEntry<T = Record<string, unknown>> {
    id: string;
    slug: string;
    title: string;
    data: T;
    sort_order: number;
    status: 'draft' | 'published';
    published_at: string | null;
}
interface IVoltpressGlobal<T = Record<string, unknown>> {
    id: string;
    data: T;
    updated_at: string;
}
interface IVoltpressMedia {
    id: string;
    name: string;
    file_url: string;
    thumbnail_url: string;
    created_at: string;
}
interface IVoltpressPaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ICollectionListInput {
    locale?: string;
    page?: number;
    items_per_page?: number;
    search?: string;
    sort_by?: string;
    status?: 'draft' | 'published';
    [key: string]: string | number | undefined;
}
interface ICollectionListOutput<T> {
    locale: string | null;
    entries: IVoltpressCollectionEntry<T>[];
    meta: IVoltpressPaginationMeta;
}
interface ICollectionFindInput {
    locale?: string;
    depth?: 0 | 1;
}

interface IGlobalGetInput {
    locale?: string;
}
interface IGlobalGetOutput<T> {
    collection: {
        id: string;
        name: string;
        slug: string;
        fields: unknown[];
    };
    entry: IVoltpressGlobal<T> | null;
}

export { type Block, type ICollectionFindInput, type ICollectionListInput, type ICollectionListOutput, type IGlobalGetInput, type IGlobalGetOutput, type IVoltpressApiResponse, type IVoltpressCollectionEntry, type IVoltpressGlobal, type IVoltpressMedia, type IVoltpressPaginationMeta, type InlineContent, type Mark, type TableRow, type VoltpressConfig, createVoltpress };
