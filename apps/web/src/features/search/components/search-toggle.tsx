import type * as React from 'react';
import { type FC, Fragment, type ReactNode } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import ContentTypeIcon from '@/components/content-type-icon';
import MaterialSymbolsFeatureSearch from '@/components/icons/material-symbols/MaterialSymbolsFeatureSearch';
import { buttonVariants } from '@/components/ui/button';
import { PortalContainerProvider } from '@/components/ui/portal-container-context';
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

import {
    SEARCH_TYPE_ALL,
    SEARCH_TYPE_LABELS,
    type SearchTypeValue,
} from '../types';

type Props = {
    type?: SearchTypeValue;
    setType: (type: SearchTypeValue) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    allowedTypes?: ContentTypeEnum[];
};

type SearchType = {
    slug: SearchTypeValue;
    icon: ReactNode;
    group: 'all' | 'content' | 'community';
};

const typeIcon = (contentType: ContentTypeEnum) => (
    <ContentTypeIcon contentType={contentType} className="size-4!" />
);

const SEARCH_TYPES: SearchType[] = [
    {
        slug: SEARCH_TYPE_ALL,
        icon: <MaterialSymbolsFeatureSearch className="size-4!" />,
        group: 'all',
    },
    {
        slug: ContentTypeEnum.ANIME,
        icon: typeIcon(ContentTypeEnum.ANIME),
        group: 'content',
    },
    {
        slug: ContentTypeEnum.MANGA,
        icon: typeIcon(ContentTypeEnum.MANGA),
        group: 'content',
    },
    {
        slug: ContentTypeEnum.NOVEL,
        icon: typeIcon(ContentTypeEnum.NOVEL),
        group: 'content',
    },
    {
        slug: ContentTypeEnum.CHARACTER,
        icon: typeIcon(ContentTypeEnum.CHARACTER),
        group: 'content',
    },
    {
        slug: ContentTypeEnum.PERSON,
        icon: typeIcon(ContentTypeEnum.PERSON),
        group: 'content',
    },
    {
        slug: ContentTypeEnum.USER,
        icon: typeIcon(ContentTypeEnum.USER),
        group: 'community',
    },
];

const GROUP_LABELS: Record<string, string | undefined> = {
    all: undefined,
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
        <PortalContainerProvider value={null}>
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
                                                            {
                                                                SEARCH_TYPE_LABELS[
                                                                    type.slug
                                                                ]
                                                            }
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
        </PortalContainerProvider>
    );
};

export default SearchToggle;
