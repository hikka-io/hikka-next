import { ReactElement, ReactNode } from 'react';

import type { UserRoleEnum } from '@hikka/api';

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

        type ListStat = {
            percentage: number;
            value: number;
            icon?: ReactNode;
            color?: string;
            name?: string;
        };

        type View = 'table' | 'grid' | 'list';
    }
}
