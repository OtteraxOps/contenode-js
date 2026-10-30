type ContenodeConfig = {
    apiUrl: string;
    deliveryToken: string;
};
declare function createContenode(config: ContenodeConfig): {
    manifest: {
        get(): Promise<IContenodeManifest>;
    };
    collection<T = Record<string, unknown>>(slug: string): {
        list(input?: ICollectionListInput): Promise<ICollectionListOutput<T>>;
        find(entrySlug: string, input?: ICollectionFindInput): Promise<IContenodeCollectionEntry<T>>;
        schema(): Promise<ICollectionSchemaOutput>;
    };
    global<T = Record<string, unknown>>(slug: string): {
        get(input?: IGlobalGetInput): Promise<IGlobalGetOutput<T>>;
    };
};

interface IContenodeApiResponse<T> {
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

interface IContenodeCollectionEntry<T = Record<string, unknown>> {
    id: string;
    slug: string;
    title: string;
    data: T;
    sort_order: number;
    status: 'draft' | 'published';
    published_at: string | null;
}
type IContenodeGlobal<T = Record<string, unknown>> = T & {
    updated_at: string;
};
interface IContenodeMedia {
    id: string;
    name: string;
    file_url: string;
    thumbnail_url: string;
    created_at: string;
}
interface IContenodePaginationMeta {
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
    entries: IContenodeCollectionEntry<T>[];
    meta: IContenodePaginationMeta;
}
interface ICollectionFindInput {
    locale?: string;
    depth?: 0 | 1;
}
interface ICollectionSchemaOutput {
    schema: {
        slug: string;
        name: string;
        kind: 'collection';
        fields: Record<string, unknown>[];
    };
}

interface IGlobalGetInput {
    locale?: string;
}
interface IGlobalGetOutput<T> {
    global: IContenodeGlobal<T> | null;
}

interface IContenodeLocale {
    locale: string;
    is_default: boolean;
}
interface IContenodeFieldDefinition {
    [key: string]: unknown;
}
interface IContenodeSchemaEntry {
    slug: string;
    name: string;
    fields: IContenodeFieldDefinition[];
}
interface IContenodeFormManifest {
    captcha_provider: string;
    turnstile_site_key: string;
    contact_form_schema: IContenodeFieldDefinition[];
    contact_form_message: string;
    contact_form_success_message: string;
}
interface IContenodeManifest {
    locales: IContenodeLocale[];
    collections: IContenodeSchemaEntry[];
    globals: IContenodeSchemaEntry[];
    form: IContenodeFormManifest;
}

export { type Block, type ContenodeConfig, type ICollectionFindInput, type ICollectionListInput, type ICollectionListOutput, type ICollectionSchemaOutput, type IContenodeApiResponse, type IContenodeCollectionEntry, type IContenodeFieldDefinition, type IContenodeFormManifest, type IContenodeGlobal, type IContenodeLocale, type IContenodeManifest, type IContenodeMedia, type IContenodePaginationMeta, type IContenodeSchemaEntry, type IGlobalGetInput, type IGlobalGetOutput, type InlineContent, type Mark, type TableRow, createContenode };
