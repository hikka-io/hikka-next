'use client';

import type { ReactNode } from 'react';

import { range } from '@antfu/utils';

import ContentCard from '@/components/content-card/content-card';
import SkeletonCard from '@/components/content-card/content-card-skeleton';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

export interface ProgressTrackerItem {
    slug: string;
    image?: string | null;
    title: string;
}

/** Year • media-type • total-count meta row shared by every tracker widget. */
export const ProgressTrackerMeta = ({
    year,
    mediaTypeLabel,
    total,
    totalWord,
}: {
    year?: number | null;
    mediaTypeLabel?: string;
    total?: number | null;
    totalWord?: string;
}) => (
    <div className="mt-1 flex cursor-pointer items-center gap-2">
        {year && (
            <Label className="cursor-pointer text-muted-foreground text-xs">
                {year}
            </Label>
        )}
        {mediaTypeLabel && (
            <>
                <div className="size-1 rounded-full bg-muted-foreground" />
                <Label className="cursor-pointer text-muted-foreground text-xs">
                    {mediaTypeLabel}
                </Label>
            </>
        )}
        {total && (
            <>
                <div className="size-1 rounded-full bg-muted-foreground" />
                <Label className="cursor-pointer text-muted-foreground text-xs">
                    {total} {totalWord}
                </Label>
            </>
        )}
    </div>
);

interface SelectedState {
    slug: string;
    href: string;
    title: string;
    /** Year / media-type / total-count meta row. */
    details: ReactNode;
    current: number;
    total?: number;
    /** Genitive-plural unit label, e.g. "розділів" / "епізодів". */
    unitLabel: string;
    /** Singular unit for the add button, e.g. "розділ" / "епізод". */
    actionUnit: string;
}

interface Props {
    isLoading: boolean;
    isEmpty: boolean;
    emptyTitle: ReactNode;
    emptyDescription: string;
    items: ProgressTrackerItem[];
    selected?: SelectedState;
    onSelect: (slug: string) => void;
    onAdd: () => void;
    onRemove: () => void;
    onOpenSettings: () => void;
    /** The content-type-specific edit modal, rendered as-is. */
    modal?: ReactNode;
}

/**
 * Shared presentational shell for the home "in progress" widgets
 * (anime watchlist, manga/novel readlist). Each widget keeps its own data
 * fetching and optimistic-update strategy and feeds already-computed values
 * here, so the UI stays in one place without coupling the mutation logic.
 */
const ProgressTrackerView = ({
    isLoading,
    isEmpty,
    emptyTitle,
    emptyDescription,
    items,
    selected,
    onSelect,
    onAdd,
    onRemove,
    onOpenSettings,
    modal,
}: Props) => {
    if (isLoading) {
        return (
            <Stack
                className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4"
                imagePreset="cardXs"
            >
                {range(0, 6).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </Stack>
        );
    }

    return (
        <>
            {isEmpty && (
                <NotFound title={emptyTitle} description={emptyDescription} />
            )}
            {!isEmpty && items.length > 0 && (
                <div className="flex h-full flex-col gap-4">
                    <Stack
                        className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4"
                        imagePreset="cardXs"
                    >
                        {items.map((item) => (
                            <Tooltip key={item.slug}>
                                <TooltipTrigger asChild>
                                    <ContentCard
                                        onClick={() => onSelect(item.slug)}
                                        image={item.image}
                                        className={cn(
                                            'transition-opacity',
                                            selected?.slug !== item.slug &&
                                                'opacity-30 hover:opacity-60',
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-48 truncate">
                                    {item.title}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </Stack>

                    {selected && (
                        <>
                            <Link className="w-fit flex-1" to={selected.href}>
                                <h5>{selected.title}</h5>
                                {selected.details}
                            </Link>

                            <div className="flex w-full flex-col gap-2">
                                <p className="text-muted-foreground text-sm">
                                    <span className="font-bold text-foreground">
                                        {selected.current}
                                    </span>
                                    /{selected.total ?? '?'}{' '}
                                    {selected.unitLabel}
                                </p>

                                <Progress
                                    className="h-2"
                                    value={selected.current}
                                    max={selected.total || selected.current}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={onOpenSettings}
                                >
                                    <MaterialSymbolsSettingsOutlineRounded />
                                    Налаштування
                                </Button>
                                <div className="flex">
                                    <Button
                                        className="flex-1 rounded-r-none"
                                        onClick={onAdd}
                                        variant="secondary"
                                        size="md"
                                    >
                                        <MaterialSymbolsAddRounded />
                                        <div className="flex gap-1">
                                            <span className="hidden sm:block">
                                                Додати
                                            </span>
                                            <span className="capitalize sm:normal-case">
                                                {selected.actionUnit}
                                            </span>
                                        </div>
                                    </Button>
                                    <Button
                                        className="rounded-l-none"
                                        onClick={onRemove}
                                        variant="secondary"
                                        size="icon-md"
                                    >
                                        <MaterialSymbolsRemoveRounded />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            {modal}
        </>
    );
};

export default ProgressTrackerView;
