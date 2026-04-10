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
import AgeRating from '@/features/filters/age-rating';
import DateRange from '@/features/filters/date-range';
import Genre from '@/features/filters/genre';
import Localization from '@/features/filters/localization';
import MediaType from '@/features/filters/media-type';
import ReleaseStatus from '@/features/filters/release-status';
import Score from '@/features/filters/score';
import Season from '@/features/filters/season';
import Studio from '@/features/filters/studio';
import Year from '@/features/filters/year';

import { cn } from '@/utils/cn';

interface BodyProps {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

/**
 * Filter fields only — no footer, no outer padding/margin hacks.
 * Use this inside modals or any custom wrapper.
 */
export const AnimeFiltersBody: FC<BodyProps> = ({
    className,
    content_type,
    sort_type,
}) => {
    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <Genre />
            <Studio />
            <ReleaseStatus />
            <Season />
            <MediaType content_type={content_type} />
            <AgeRating />
            <Score score_type="score" />
            <Year />
            {sort_type === 'anime' && <DateRange />}
            <Localization />
        </div>
    );
};

interface FooterProps {
    className?: string;
}

/**
 * Clear filters + save-as-preset actions. Safe to render inside any layout
 * (side panel, dialog footer, drawer footer).
 */
export const AnimeFiltersFooter: FC<FooterProps> = ({ className }) => {
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
        if (Array.isArray(sort) && sort.length > 0) next.sort = sort;

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

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

/**
 * Default side-panel composition: scrollable filter body + sticky footer.
 * Kept for backward compatibility with the sidebar layout.
 */
const AnimeFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    return (
        <div className={cn('flex flex-col ', className)}>
            <AnimeFiltersBody
                className="flex-1 overflow-y-auto p-4 py-8"
                content_type={content_type}
                sort_type={sort_type}
            />
            <AnimeFiltersFooter className="bg-secondary/20 shrink-0 border-t p-4" />
        </div>
    );
};

export default AnimeFilters;
