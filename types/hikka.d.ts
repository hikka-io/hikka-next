import {
    JSXElementConstructor,
    ReactElement,
    ReactNode,
    SVGProps,
} from 'react';

declare global {
    namespace Hikka {
        type FilterProperty<T extends string> = Record<
            T,
            {
                title_ua: string;
                title_en: string;
                icon?: (props: any) => ReactElement | ReactNode;
                color?: string;
                description?: string;
                params?: Record<string, any>;
            }
        >;

        type NavRoute = {
            slug: string;
            title_ua: string;
            url: string;
            icon?: (
                props: SVGProps<SVGSVGElement>,
            ) => ReactElement<any, string | JSXElementConstructor<any>>;
            role?: API.UserRole[];
            internals?: NavRoute[];
            visible?: boolean;
        };

        type EditParamGroup = {
            title: string;
            slug: string;
        };

        type EditParamType = 'input' | 'markdown' | 'list';

        type EditParam = {
            title: string;
            slug: string;
            placeholder?: string;
            type: EditParamType;
        };

        type AnimeEditParams = {
            title_ua?: string;
            title_en?: string;
            title_ja?: string;
            synopsis_en?: string;
            synopsis_ua?: string;
            synonyms?: {
                value: string;
            }[];
        };

        type MangaEditParams = {
            title_ua?: string;
            title_en?: string;
            title_original?: string;
            synopsis_en?: string;
            synopsis_ua?: string;
            synonyms?: {
                value: string;
            }[];
        };

        type NovelEditParams = {
            title_ua?: string;
            title_en?: string;
            title_original?: string;
            synopsis_en?: string;
            synopsis_ua?: string;
            synonyms?: {
                value: string;
            }[];
        };

        type CharacterEditParams = {
            name_ua: string;
            name_en: string;
            name_ja: string;
            description_ua: string;
        };

        type PersonEditParams = {
            name_ua: string;
            name_en: string;
            name_native: string;
        };

        type TextNotification = {
            type: NotificationType;
            icon: ReactNode;
            title: string;
            description: ReactNode;
            reference: string;
            created: number;
            href: string;
            seen: boolean;
            image?: ReactNode;
        };

        type ListStat = {
            percentage: number;
            value: number;
            icon?: ReactNode;
            color?: string;
        };

        type QueryOptions = {
            enabled?: boolean;
            staleTime?: number;
            gcTime?: number;
            refetchOnWindowFocus?: boolean;
        };
    }
}
