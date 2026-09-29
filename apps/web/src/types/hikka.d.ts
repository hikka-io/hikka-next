import { ReactElement, ReactNode } from 'react';

import type {
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
                description?: string;
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

        type ListStat = {
            percentage: number;
            value: number;
            icon?: ReactNode;
            color?: string;
            name?: string;
        };

        type View = 'table' | 'grid' | 'list';

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
