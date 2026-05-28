'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { FC, useState } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { CustomCopyAddRounded } from '@/components/icons/custom/CustomCopyAddRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { FilterPresetEditModal } from '@/features/content';

import { cn } from '@/utils/cn';

export interface FiltersFooterProps {
    className?: string;
}

/**
 * Clear filters + save-as-preset actions, shared by the anime and read
 * filter panels. Implements the superset of both: the `date_range_enabled`
 * coercion and `/anime` content-type inference are inert on routes where
 * they don't apply, so the behaviour is identical to the previous
 * per-domain footers.
 */
const FiltersFooter: FC<FiltersFooterProps> = ({ className }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [currentFilters, setCurrentFilters] =
        useState<Partial<Hikka.FilterPreset> | null>(null);
    const search = useRouterState({
        select: (s) => (s.resolvedLocation ?? s.location).search,
    }) as Record<string, unknown>;
    const pathname = useRouterState({
        select: (s) => (s.resolvedLocation ?? s.location).pathname,
    });

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
    };

    const handleCreateFromCurrent = () => {
        const next: Partial<Hikka.FilterPreset> = {
            name: '',
            description: '',
        };

        const arrayStringKeys = [
            'content_types',
            'statuses',
            'seasons',
            'types',
            'genres',
            'ratings',
            'studios',
        ] as const;

        arrayStringKeys.forEach((key) => {
            const values = search[key];
            if (Array.isArray(values) && values.length > 0) {
                next[key] = values as unknown as NonNullable<
                    Hikka.FilterPreset[typeof key]
                >;
            }
        });

        const arrayNumberKeys = ['years', 'date_range'] as const;
        arrayNumberKeys.forEach((key) => {
            const values = search[key];
            if (Array.isArray(values) && values.length > 0) {
                const numberValues = values.map((v: unknown) => Number(v));
                next[key] = numberValues as unknown as NonNullable<
                    Hikka.FilterPreset[typeof key]
                >;
            }
        });

        if ('only_translated' in search && search.only_translated != null) {
            next.only_translated =
                search.only_translated === true ||
                search.only_translated === 'true';
        }
        if (
            'date_range_enabled' in search &&
            search.date_range_enabled != null
        ) {
            next.date_range_enabled =
                search.date_range_enabled === true ||
                search.date_range_enabled === 'true';
        }

        const sort = search.sort;
        if (typeof sort === 'string' && sort) next.sort = sort;

        const order = search.order;
        if (order) next.order = order as string;

        if (!next.content_types) {
            if (pathname.includes('/anime')) {
                next.content_types = [ContentTypeEnum.ANIME];
            } else if (pathname.includes('/manga')) {
                next.content_types = [ContentTypeEnum.MANGA];
            } else if (pathname.includes('/novel')) {
                next.content_types = [ContentTypeEnum.NOVEL];
            }
        }

        setCurrentFilters(next);
        setOpen(true);
    };

    return (
        <>
            <div className={cn('flex gap-2', className)}>
                <Button
                    size="md"
                    className="flex-1"
                    variant="destructive"
                    onClick={clearFilters}
                >
                    <AntDesignClearOutlined /> Очистити
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon-md"
                            variant="secondary"
                            onClick={handleCreateFromCurrent}
                        >
                            <CustomCopyAddRounded />
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent>
                            <p className="text-sm">
                                Створити пресет з поточних фільтрів
                            </p>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent
                    className="md:max-w-xl"
                    title="Створити пресет з поточних"
                >
                    {currentFilters && (
                        <FilterPresetEditModal
                            filterPreset={currentFilters as Hikka.FilterPreset}
                            onClose={() => setOpen(false)}
                        />
                    )}
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default FiltersFooter;
