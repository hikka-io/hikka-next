import type { ReactNode, Ref } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import Spinner from '@/components/ui/spinner';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type TrackerItem = {
    slug: string;
    image: string | null;
    title: string;
    isSelected: boolean;
    onSelect: () => void;
};

type SelectedEntry = {
    href: string;
    title: string;
    year: number | null;
    mediaTypeLabel?: string;
    total?: number;
    totalDeclension?: string;
    current: number;
    /** Plural unit for the progress line, e.g. "епізодів" / "розділів". */
    progressUnit: string;
    /** Singular unit for the add button, e.g. "епізод" / "розділ". */
    addUnitLabel: string;
    onAdd: () => void;
    onRemove: () => void;
    onOpenEdit: () => void;
};

type EditModalState = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
};

type Props = {
    items: TrackerItem[];
    listRef: Ref<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    selected?: SelectedEntry;
    editModal?: EditModalState;
};

/**
 * Shared presentation for the home watch/read progress trackers: the content
 * grid, the selected-entry header/progress/controls, and the edit modal
 * wrapper. All data, debounce, and mutation logic lives in the caller.
 */
const ProgressTrackerView = ({
    items,
    listRef,
    isFetchingNextPage,
    hasNextPage,
    selected,
    editModal,
}: Props) => {
    return (
        <>
            <div className="flex flex-col gap-4">
                <Stack
                    visibleScrollbar
                    className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4"
                    imagePreset="cardXs"
                >
                    {items.map((item) => (
                        <Tooltip key={item.slug}>
                            <TooltipTrigger asChild>
                                <ContentCard
                                    onClick={item.onSelect}
                                    image={item.image}
                                    containerClassName="rounded-(--base-radius)"
                                    className={cn(
                                        'transition-opacity',
                                        !item.isSelected &&
                                            'opacity-30 hover:opacity-60',
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipPortal>
                                <TooltipContent className="max-w-48">
                                    <span className="block truncate">
                                        {item.title}
                                    </span>
                                </TooltipContent>
                            </TooltipPortal>
                        </Tooltip>
                    ))}
                    {hasNextPage && (
                        <div
                            ref={listRef}
                            className="flex items-center justify-center"
                        >
                            {isFetchingNextPage && <Spinner />}
                        </div>
                    )}
                </Stack>

                {selected && (
                    <>
                        <Link className="w-fit flex-1" to={selected.href}>
                            <h5>{selected.title}</h5>
                            <div className="mt-1 flex cursor-pointer items-center gap-2">
                                {selected.year && (
                                    <Label className="cursor-pointer text-muted-foreground text-xs">
                                        {selected.year}
                                    </Label>
                                )}
                                {selected.mediaTypeLabel && (
                                    <>
                                        <div className="size-1 rounded-full bg-muted-foreground" />
                                        <Label className="cursor-pointer text-muted-foreground text-xs">
                                            {selected.mediaTypeLabel}
                                        </Label>
                                    </>
                                )}
                                {selected.total && (
                                    <>
                                        <div className="size-1 rounded-full bg-muted-foreground" />
                                        <Label className="cursor-pointer text-muted-foreground text-xs">
                                            {selected.total}{' '}
                                            {selected.totalDeclension}
                                        </Label>
                                    </>
                                )}
                            </div>
                        </Link>

                        <div className="flex w-full flex-col gap-2">
                            <p className="text-muted-foreground text-sm">
                                <span className="font-bold text-foreground">
                                    {selected.current}
                                </span>
                                /{selected.total ?? '?'} {selected.progressUnit}
                            </p>
                            <Progress
                                className="h-2"
                                value={selected.current}
                                max={selected.total ?? selected.current}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon-md"
                                className="shrink-0"
                                onClick={selected.onOpenEdit}
                            >
                                <MaterialSymbolsSettingsOutlineRounded />
                            </Button>
                            <div className="flex flex-1">
                                <Button
                                    className="flex-1 rounded-r-none"
                                    onClick={selected.onAdd}
                                    variant="secondary"
                                    size="md"
                                >
                                    <MaterialSymbolsAddRounded />
                                    <div className="flex gap-1">
                                        <span className="hidden sm:block">
                                            Додати
                                        </span>
                                        <span className="capitalize sm:normal-case">
                                            {selected.addUnitLabel}
                                        </span>
                                    </div>
                                </Button>
                                <Button
                                    className="rounded-l-none"
                                    onClick={selected.onRemove}
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
            {selected && editModal && (
                <ResponsiveModal
                    open={editModal.open}
                    onOpenChange={editModal.onOpenChange}
                    forceDesktop
                >
                    <ResponsiveModalContent className="md:max-w-xl">
                        <ResponsiveModalHeader>
                            <ResponsiveModalTitle>
                                {editModal.title}
                            </ResponsiveModalTitle>
                        </ResponsiveModalHeader>
                        {editModal.children}
                    </ResponsiveModalContent>
                </ResponsiveModal>
            )}
        </>
    );
};

export default ProgressTrackerView;
