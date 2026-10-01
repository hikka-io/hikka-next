import type * as React from 'react';
import { type FC, Fragment } from 'react';

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
    SEARCH_ENTITIES,
    type SearchEntity,
    type SearchEntityGroup,
} from '../search-entities';
import {
    SEARCH_TYPE_ALL,
    type SearchEntityType,
    type SearchTypeValue,
} from '../types';

type Props = {
    type?: SearchTypeValue;
    setType: (type: SearchTypeValue) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    allowedTypes?: SearchEntityType[];
};

/** Toggle chrome, not entity data — the registry knows nothing about it. */
const GROUP_HEADINGS: Record<SearchEntityGroup, string> = {
    content: 'Контент',
    community: 'Спільнота',
};

const GROUP_ORDER: SearchEntityGroup[] = ['content', 'community'];

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

    const visibleEntities = allowedTypes?.length
        ? SEARCH_ENTITIES.filter((entity) => allowedTypes.includes(entity.type))
        : SEARCH_ENTITIES;

    // Only groups that actually have entries get rendered, so the separator can
    // key off a rendered group rather than its position in the group order.
    const groups = GROUP_ORDER.map((group) => ({
        group,
        entities: visibleEntities.filter((entity) => entity.group === group),
    })).filter(({ entities }) => entities.length > 0);

    const renderItem = (entity: SearchEntity) => (
        <SelectItem key={entity.type} value={entity.type}>
            <div className="flex items-center gap-2">
                {entity.icon}
                <span>{entity.label}</span>
            </div>
        </SelectItem>
    );

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
                        <SelectGroup>
                            <SelectItem value={SEARCH_TYPE_ALL}>
                                <div className="flex items-center gap-2">
                                    <MaterialSymbolsFeatureSearch className="size-4!" />
                                    <span>Усе</span>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                        {groups.map(({ group, entities }) => (
                            <Fragment key={group}>
                                <SelectSeparator />
                                <SelectGroup heading={GROUP_HEADINGS[group]}>
                                    {entities.map(renderItem)}
                                </SelectGroup>
                            </Fragment>
                        ))}
                    </SelectList>
                </SelectContent>
            </Select>
        </PortalContainerProvider>
    );
};

export default SearchToggle;
