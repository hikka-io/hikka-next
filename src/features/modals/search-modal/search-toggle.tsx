'use client';

import * as React from 'react';
import { FC, ReactNode } from 'react';
import MaterialSymbolsAccountBox from '~icons/material-symbols/account-box';
import MaterialAnimatedImages from '~icons/material-symbols/animated-images';
import MaterialSymbolsFace3 from '~icons/material-symbols/face-3';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsPerson from '~icons/material-symbols/person';

import { buttonVariants } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { cn } from '@/utils/utils';

interface Props {
    type?: API.ContentType | 'user';
    setType: (type: API.ContentType) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    allowedTypes?: (API.ContentType | 'user')[];
}

type SearchType = {
    slug: API.ContentType | 'user';
    title_ua: string;
    icon: ReactNode;
};

const SEARCH_TYPES: SearchType[] = [
    {
        slug: 'anime',
        title_ua: 'Аніме',
        icon: <MaterialAnimatedImages className="!size-4" />,
    },
    {
        slug: 'manga',
        title_ua: 'Манґа',
        icon: <MaterialSymbolsPalette className="!size-4" />,
    },
    {
        slug: 'novel',
        title_ua: 'Ранобе',
        icon: <MaterialSymbolsMenuBookRounded className="!size-4" />,
    },
    {
        slug: 'character',
        title_ua: 'Персонаж',
        icon: <MaterialSymbolsFace3 className="!size-4" />,
    },
    {
        slug: 'person',
        title_ua: 'Людина',
        icon: <MaterialSymbolsPerson className="!size-4" />,
    },
    {
        slug: 'user',
        title_ua: 'Користувач',
        icon: <MaterialSymbolsAccountBox className="!size-4" />,
    },
];

const SearchToggle: FC<Props> = ({
    type,
    allowedTypes,
    setType,
    disabled,
    inputRef,
}) => {
    const handleOnValueChange = (value: API.ContentType[]) => {
        value && setType(value[0]);
        inputRef.current?.focus();
    };

    const filteredTypes = allowedTypes
        ? SEARCH_TYPES.filter((type) => allowedTypes.includes(type.slug))
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
                    <SelectGroup>
                        {filteredTypes.map((type) => (
                            <SelectItem value={type.slug}>
                                <div className="flex items-center gap-2">
                                    {type.icon}
                                    <span>{type.title_ua}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default SearchToggle;
