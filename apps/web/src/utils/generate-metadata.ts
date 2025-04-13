import { Metadata } from 'next';
import {
    DeprecatedMetadataFields,
    TemplateString,
} from 'next/dist/lib/metadata/types/metadata-types';

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

/**
 * Extended metadata properties interface
 */
interface MetadataProps extends Metadata {
    title?: string | TemplateString | null | undefined;
    description?: string | null | undefined;
    images?: OGImage | OGImage[] | undefined;
    siteName?: string;
    other?: {
        [name: string]: string | number | (string | number)[];
    } & DeprecatedMetadataFields;
}

/**
 * Generates complete metadata for the application by combining provided values with defaults
 *
 * @param props - Metadata properties to be used, with any missing values falling back to defaults
 * @returns Complete Metadata object ready for Next.js
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
}: MetadataProps): Metadata => {
    // Determine values, falling back to defaults when needed
    const resolvedSiteName = siteName || DEFAULTS.siteName;
    const resolvedTitle = title || DEFAULTS.title;
    const resolvedDescription = description || DEFAULTS.description;
    const resolvedImages = images || DEFAULTS.images;

    return {
        // Base metadata
        title: resolvedTitle,
        description: resolvedDescription,

        // Open Graph metadata
        openGraph: {
            siteName: resolvedSiteName,
            title: resolvedTitle,
            description: resolvedDescription,
            images: resolvedImages,
            ...openGraph, // Allow overriding default OG properties
        },

        // Twitter metadata
        twitter: {
            site: resolvedSiteName,
            title: resolvedTitle,
            description: resolvedDescription,
            images: resolvedImages,
            ...twitter, // Allow overriding default Twitter properties
        },

        // Other custom metadata
        other,

        // Any additional properties passed
        ...restProps,
    };
};

export default generateMetadata;
