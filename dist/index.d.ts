interface VoltpressConfig {
    apiUrl: string;
    clientId: string;
    clientSecret: string;
}
declare function configureVoltpress(config: VoltpressConfig): void;
declare function isVoltpressConfigured(): boolean;

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

interface IVoltpressModelableFile {
    id: string;
    name: string;
    thumbnail_url: string;
    file_url: string;
    created_at: string;
}
interface IVoltpressFaqCategory {
    id: string;
    name: string;
    slug: string;
    sort_order: number;
}
interface IVoltpressFaqItem {
    id: string;
    faq_category_id: string | null;
    question: string;
    answer: string;
    sort_order: number;
    category?: IVoltpressFaqCategory;
}
interface IVoltpressTeamMember {
    id: string;
    name: string;
    role_title: string;
    bio: string;
    meta: Record<string, unknown> | null;
    sort_order: number;
    image: IVoltpressModelableFile;
}
interface IVoltpressBlogCategory {
    id: string;
    name: string;
    slug: string;
}
interface IVoltpressBlogTag {
    id: string;
    name: string;
    slug: string;
}
interface IVoltpressBlogPostListItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
    view_count: number;
    author: {
        id: string;
        name: string;
    } | null;
    category: IVoltpressBlogCategory | null;
    tags: IVoltpressBlogTag[];
    image: IVoltpressModelableFile | null;
}
interface IVoltpressBlogPostDetail extends IVoltpressBlogPostListItem {
    content: string | null;
    blocks: Block[] | null;
    meta_title: string | null;
    meta_description: string | null;
    created_at: string;
}

interface IGetFaqListInput {
    placement?: string;
    faq_category_id?: string;
    page?: number;
    items_per_page?: number;
}
type IGetFaqListOutput = IVoltpressFaqItem[];

declare const faqService: {
    getFaqList(input?: IGetFaqListInput): Promise<IGetFaqListOutput>;
};

interface IGetTeamMemberListInput {
    page?: number;
    items_per_page?: number;
}
type IGetTeamMemberListOutput = IVoltpressTeamMember[];

declare const teamMemberService: {
    getTeamMemberList(input?: IGetTeamMemberListInput): Promise<IGetTeamMemberListOutput>;
};

interface IGetBlogPostListInput {
    blog_category_id?: number;
    blog_tag_id?: number;
    page?: number;
    items_per_page?: number;
    sort_by?: string;
    search?: string;
}
type IGetBlogPostListOutput = IVoltpressBlogPostListItem[];
interface IGetBlogPostBySlugInput {
    slug: string;
}
type IGetBlogPostBySlugOutput = IVoltpressBlogPostDetail;

declare const blogPostService: {
    getBlogPostList(input?: IGetBlogPostListInput): Promise<IGetBlogPostListOutput>;
    getBlogPostBySlug(input: IGetBlogPostBySlugInput): Promise<IGetBlogPostBySlugOutput>;
};

export { type Block, type IGetBlogPostBySlugInput, type IGetBlogPostBySlugOutput, type IGetBlogPostListInput, type IGetBlogPostListOutput, type IGetFaqListInput, type IGetFaqListOutput, type IGetTeamMemberListInput, type IGetTeamMemberListOutput, type IVoltpressApiResponse, type IVoltpressBlogCategory, type IVoltpressBlogPostDetail, type IVoltpressBlogPostListItem, type IVoltpressBlogTag, type IVoltpressFaqCategory, type IVoltpressFaqItem, type IVoltpressModelableFile, type IVoltpressTeamMember, type InlineContent, type Mark, type TableRow, type VoltpressConfig, blogPostService, configureVoltpress, faqService, isVoltpressConfigured, teamMemberService };
