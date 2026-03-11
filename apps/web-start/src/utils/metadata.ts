/**
 * Default metadata values for the Hikka application
 */
export const DEFAULTS = {
    siteName: 'Hikka',
    images: 'https://hikka.io/preview.jpg',
    title: {
        default: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
        template: '%s / Hikka',
    },
    description:
        'Hikka - українська онлайн енциклопедія аніме, манґи та ранобе. Весь список, манґи та ранобе, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого та прочитаного, кастомізуй профіль та ділись з друзями.',
};

/**
 * Defines the structure for Open Graph image metadata
 */
type OGImageDescriptor = {
    url: string | URL;
    secureUrl?: string | URL;
    alt?: string;
    type?: string;
    width?: string | number;
    height?: string | number;
};

/**
 * Types that Open Graph images can take
 */
type OGImage = string | OGImageDescriptor | URL;

type TemplateString = {
    default: string;
    template: string;
};

/**
 * Extended metadata properties interface
 */
interface MetadataProps {
    title?: string | TemplateString | null;
    description?: string | null;
    images?: OGImage | OGImage[];
    siteName?: string;
    other?: Record<string, string | number | (string | number)[]>;
    openGraph?: Record<string, any>;
    twitter?: Record<string, any>;
    [key: string]: any;
}

type Metadata = Record<string, any>;

/**
 * Generates complete metadata for the application by combining provided values with defaults
 *
 * @param props - Metadata properties to be used, with any missing values falling back to defaults
 * @returns Complete Metadata object
 */
const generateMetadata = ({
    title,
    description,
    images,
    siteName,
    other,
    openGraph,
    twitter,
    ...restProps
}: MetadataProps = {}): Metadata => {
    const resolvedSiteName = siteName || DEFAULTS.siteName;
    const resolvedTitle = title || DEFAULTS.title;
    const resolvedDescription = description || DEFAULTS.description;
    const resolvedImages = images || DEFAULTS.images;

    return {
        title: resolvedTitle,
        description: resolvedDescription,

        openGraph: {
            siteName: resolvedSiteName,
            title: resolvedTitle,
            description: resolvedDescription,
            images: resolvedImages,
            ...openGraph,
        },

        twitter: {
            site: resolvedSiteName,
            title: resolvedTitle,
            description: resolvedDescription,
            images: resolvedImages,
            ...twitter,
        },

        other,

        ...restProps,
    };
};

interface HeadMetaProps {
    title: string | TemplateString;
    description?: string | null;
    image?: string | null;
    url?: string;
    robots?: { index?: boolean };
    other?: Record<string, string | number>;
    openGraph?: { type?: string; authors?: string[] };
    canonical?: string;
    keywords?: string;
}

function resolveTitle(title: string | TemplateString): string {
    const base = typeof title === 'string' ? title : title.default;
    if (base.endsWith(' / Hikka') || base.startsWith('Hikka')) return base;
    return `${base} / Hikka`;
}

function generateHeadMeta(props: HeadMetaProps) {
    const siteName = DEFAULTS.siteName;
    const defaultImage = DEFAULTS.images;

    const resolvedTitle = resolveTitle(props.title);
    const resolvedDescription = props.description || DEFAULTS.description;
    const resolvedImage = props.image || defaultImage;

    const meta: Record<string, any>[] = [
        { title: resolvedTitle },
        { name: 'description', content: resolvedDescription },
        { property: 'og:title', content: resolvedTitle },
        { property: 'og:description', content: resolvedDescription },
        { property: 'og:site_name', content: siteName },
        { property: 'og:image', content: resolvedImage },
        { property: 'og:type', content: props.openGraph?.type || 'website' },
        { property: 'og:locale', content: 'uk_UA' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: resolvedTitle },
        { name: 'twitter:description', content: resolvedDescription },
        { name: 'twitter:image', content: resolvedImage },
    ];

    if (props.url) {
        meta.push({ property: 'og:url', content: props.url });
    }

    if (props.openGraph?.authors) {
        for (const author of props.openGraph.authors) {
            meta.push({ property: 'article:author', content: author });
        }
    }

    if (props.robots?.index === false) {
        meta.push({ name: 'robots', content: 'noindex' });
    }

    if (props.keywords) {
        meta.push({ name: 'keywords', content: props.keywords });
    }

    if (props.other) {
        for (const [key, val] of Object.entries(props.other)) {
            meta.push({ name: key, content: String(val) });
        }
    }

    const links: Record<string, string>[] = [];

    if (props.canonical) {
        links.push({ rel: 'canonical', href: props.canonical });
    } else if (props.url) {
        links.push({ rel: 'canonical', href: props.url });
    }

    return { meta, links };
}

export { generateMetadata, generateHeadMeta };
