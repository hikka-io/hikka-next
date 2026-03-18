'use client';

import { ContentTypeEnum } from '@hikka/client';
import * as React from 'react';
import { FC, Fragment, ReactNode } from 'react';

import MaterialSymbolsAccountBox from '@/components/icons/material-symbols/MaterialSymbolsAccountBox';
import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsFeatureSearch from '@/components/icons/material-symbols/MaterialSymbolsFeatureSearch';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';

import { SEARCH_TYPE_ALL, SearchTypeValue } from '../types';
import { buttonVariants } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { cn } from '@/utils/cn';

interface Props {
    type?: SearchTypeValue;
    setType: (type: SearchTypeValue) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    allowedTypes?: ContentTypeEnum[];
}

type SearchType = {
    slug: SearchTypeValue;
    title_ua: string;
    icon: ReactNode;
    group: 'all' | 'content' | 'community';
};

const SEARCH_TYPES: SearchType[] = [
    {
        slug: SEARCH_TYPE_ALL,
        title_ua: 'Усе',
        icon: <MaterialSymbolsFeatureSearch className="!size-4" />,
        group: 'all',
    },
    {
        slug: ContentTypeEnum.ANIME,
        title_ua: 'Аніме',
        icon: <MaterialSymbolsAnimatedImages className="!size-4" />,
        group: 'content',
    },
    {
        slug: ContentTypeEnum.MANGA,
        title_ua: 'Манґа',
        icon: <MaterialSymbolsPalette className="!size-4" />,
        group: 'content',
    },
    {
        slug: ContentTypeEnum.NOVEL,
        title_ua: 'Ранобе',
        icon: <MaterialSymbolsMenuBookRounded className="!size-4" />,
        group: 'content',
    },
    {
        slug: ContentTypeEnum.CHARACTER,
        title_ua: 'Персонаж',
        icon: <MaterialSymbolsFace3 className="!size-4" />,
        group: 'content',
    },
    {
        slug: ContentTypeEnum.PERSON,
        title_ua: 'Людина',
        icon: <MaterialSymbolsPerson className="!size-4" />,
        group: 'content',
    },
    {
        slug: ContentTypeEnum.USER,
        title_ua: 'Користувач',
        icon: <MaterialSymbolsAccountBox className="!size-4" />,
        group: 'community',
    },
];

const GROUP_LABELS: Record<string, string> = {
    all: 'Пошук',
    content: 'Контент',
    community: 'Спільнота',
};

const SearchToggle: FC<Props> = ({
    type,
    allowedTypes,
    setType,
    disabled,
    inputRef,
}) => {
    const handleOnValueChange = (value: SearchTypeValue[]) => {
        value && setType(value[0]);
        inputRef.current?.focus();
    };

    const filteredTypes = allowedTypes
        ? SEARCH_TYPES.filter(
              (t) =>
                  t.slug === SEARCH_TYPE_ALL ||
                  allowedTypes.includes(t.slug as ContentTypeEnum),
          )
        : SEARCH_TYPES;

    return (
        <Select
            disabled={disabled}
            value={type ? [type] : undefined}
            onValueChange={handleOnValueChange}
        >
            <SelectTrigger
                className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'h-8',
                )}
                asChild
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    {Object.entries(GROUP_LABELS).map(
                        ([group, label], index) => {
                            const items = filteredTypes.filter(
                                (t) => t.group === group,
                            );
                            if (items.length === 0) return null;
                            return (
                                <Fragment key={group}>
                                    {index > 0 && <SelectSeparator />}
                                    <SelectGroup heading={label}>
                                        {items.map((type) => (
                                            <SelectItem
                                                key={type.slug}
                                                value={type.slug}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {type.icon}
                                                    <span>
                                                        {type.title_ua}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </Fragment>
                            );
                        },
                    )}
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default SearchToggle;
