import { ReactElement, ReactNode, SVGProps } from 'react';

import type {
    ContentTypeEnum,
    UiPreferencesOutput,
    UiStylesOutput,
    UserRoleEnum,
} from '@hikka/api';

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
            search?: Record<string, unknown>;
            icon?: (props: any) => ReactElement;
            role?: UserRoleEnum[];
            visible?: boolean;
            items?: NavRoute[];
            linkProps?: Record<string, any>;
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

        type NotificationActor = {
            username?: string;
            avatar?: string;
            href?: string;
        };

        type NotificationAccent =
            | 'primary'
            | 'success'
            | 'warning'
            | 'destructive'
            | 'info'
            | 'neutral';

        type Notification = {
            reference: string;
            type: import('@hikka/api').NotificationTypeEnum;
            created: number;
            seen: boolean;

            title: string;
            description: ReactNode;
            href: string;
            typeIcon: ReactNode;
            accent: NotificationAccent;

            actor?: NotificationActor;
            preview?: string;
            scoreSign?: 1 | -1;
            contentImage?: string;
        };

        type ListStat = {
            percentage: number;
            value: number;
            icon?: ReactNode;
            color?: string;
            name?: string;
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
            score?: number[];
            date_range_enabled?: boolean;
            date_range?: number[] | null;
        };

        type PlausibleEvents = {
            'movie-banner-click': never;
            'year-summary-banner-click': never;
        };

        type EventTheme = {
            id: string;
            name: string;
            styles?: UiStylesOutput;
            effects?: NonNullable<UiPreferencesOutput['effect']>[];
            startDate: Date;
            endDate: Date;
        };
    }
}
