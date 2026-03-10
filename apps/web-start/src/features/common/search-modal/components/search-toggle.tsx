'use client';

import { ContentTypeEnum } from '@hikka/client';
import * as React from 'react';
import { FC, ReactNode } from 'react';

import MaterialSymbolsAccountBox from '@/components/icons/material-symbols/MaterialSymbolsAccountBox';
import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
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

import { cn } from '@/utils/cn';

interface Props {
    type?: ContentTypeEnum;
    setType: (type: ContentTypeEnum) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    allowedTypes?: ContentTypeEnum[];
}

type SearchType = {
    slug: ContentTypeEnum;
    title_ua: string;
    icon: ReactNode;
};

const SEARCH_TYPES: SearchType[] = [
    {
        slug: ContentTypeEnum.ANIME,
        title_ua: 'Аніме',
        icon: <MaterialSymbolsAnimatedImages className="!size-4" />,
    },
    {
        slug: ContentTypeEnum.MANGA,
        title_ua: 'Манґа',
        icon: <MaterialSymbolsPalette className="!size-4" />,
    },
    {
        slug: ContentTypeEnum.NOVEL,
        title_ua: 'Ранобе',
        icon: <MaterialSymbolsMenuBookRounded className="!size-4" />,
    },
    {
        slug: ContentTypeEnum.CHARACTER,
        title_ua: 'Персонаж',
        icon: <MaterialSymbolsFace3 className="!size-4" />,
    },
    {
        slug: ContentTypeEnum.PERSON,
        title_ua: 'Людина',
        icon: <MaterialSymbolsPerson className="!size-4" />,
    },
    {
        slug: ContentTypeEnum.USER,
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
    const handleOnValueChange = (value: ContentTypeEnum[]) => {
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
                            <SelectItem key={type.slug} value={type.slug}>
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
