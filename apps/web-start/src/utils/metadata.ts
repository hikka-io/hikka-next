/**
 * Default metadata values for the Hikka application
 */
export const DEFAULTS = {
    siteName: 'Hikka',
    images: '/preview.jpg',
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

export { generateMetadata };
