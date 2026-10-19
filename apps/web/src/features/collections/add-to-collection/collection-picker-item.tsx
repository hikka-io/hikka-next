import { type FC, useEffect, useRef } from 'react';

import { Check, ChevronRight, Layers } from 'lucide-react';

import type { UserCollectionResponse } from '@hikka/api';
import { COLLECTION_VISIBILITY } from '@hikka/core';

import { HorizontalCardImage } from '@/components/horizontal-card';
import { COLLECTION_VISIBILITY_ICONS } from '@/components/icons/collection-visibility-icons';
import { cn } from '@/utils/cn';

import { COLLECTION_MAX_ENTRIES } from './constants';

type Props = {
    collection: UserCollectionResponse;
    focusOnMount?: boolean;
    onSelect: () => void;
};

const CollectionPickerItem: FC<Props> = ({
    collection,
    focusOnMount,
    onSelect,
}) => {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (focusOnMount) ref.current?.focus();
    }, [focusOnMount]);

    const member = collection.has_content;
    const full = !member && collection.entries >= COLLECTION_MAX_ENTRIES;
    const VisibilityIcon = COLLECTION_VISIBILITY_ICONS[collection.visibility];

    return (
        <button
            ref={ref}
            type="button"
            disabled={full}
            onClick={onSelect}
            className={cn(
                '-mt-px flex w-full cursor-pointer items-center gap-3 border-transparent border-y px-4 py-2 text-left transition-colors duration-100 first:mt-0 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent',
                member &&
                    'relative border-primary-border bg-primary hover:bg-primary-border',
            )}
        >
            <HorizontalCardImage
                image={collection.image}
                imageBlur={collection.nsfw || collection.spoiler}
                className="pointer-events-none w-9"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                    className={cn(
                        'truncate font-medium text-sm',
                        member && 'text-primary-foreground',
                    )}
                >
                    {collection.title}
                </span>
                <span className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                        <Layers className="size-3" />
                        {collection.entries}
                    </span>
                    <span className="flex items-center gap-1">
                        <VisibilityIcon className="size-3" />
                        {COLLECTION_VISIBILITY[collection.visibility].label}
                    </span>
                </span>
                {full && (
                    <span className="text-warning-foreground text-xs">
                        Досягнуто ліміту {COLLECTION_MAX_ENTRIES} позицій
                    </span>
                )}
            </div>
            {member ? (
                <Check className="size-4 shrink-0 text-primary-foreground" />
            ) : (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            )}
        </button>
    );
};

export default CollectionPickerItem;
