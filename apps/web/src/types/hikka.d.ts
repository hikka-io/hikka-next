import { UserRoleEnum } from '@hikka/client';
import { ReactElement, ReactNode, SVGProps } from 'react';

declare global {
    namespace Hikka {
        type FilterProperty<
            T extends string,
            ExtraProps extends Record<string, any> = Record<string, any>,
        > = Record<
            T,
            {
                title_ua: string;
                title_en: string;
                icon?: (props: any) => ReactElement;
                color?: string;
                description?: string;
                params?: Record<string, any>;
            } & ExtraProps
        >;

        type NavRoute = {
            slug: string;
            title_ua: string;
            url: string;
            icon?: (props: any) => ReactElement;
            role?: UserRoleEnum[];
            visible?: boolean;
            items?: NavRoute[];
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
            name?: string;
        };

        type QueryOptions = {
            enabled?: boolean;
            staleTime?: number;
            gcTime?: number;
            refetchOnWindowFocus?: boolean;
            initialData?: undefined;
        };

        type View = 'table' | 'grid' | 'list';

        type Scope = {
            slug: string;
            level: ScopeLevel;
            title_ua: string;
        };

        type ScopeGroup = {
            slug: string;
            title_ua: string;
            level: ScopeLevel;
            scopes: typeof SCOPES;
        };

        type ScopeLevel = {
            icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
            color: string;
        };

        type FilterPreset = {
            id: string;
            name: string;
            description?: string;
            content_types: ContentTypeEnum[];
            statuses?: string[];
            seasons?: string[];
            types?: string[];
            genres?: string[];
            only_translated?: boolean;
            sort?: string;
            order?: string;
            ratings?: string[];
            studios?: string[];
            years?: number[];
            date_range_enabled?: boolean;
            date_range?: number[] | null;
        };

        type PlausibleEvents = {
            'movie-banner-click': never;
        };
    }
}
