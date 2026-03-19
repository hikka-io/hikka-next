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
import Sort from '@/features/filters/sort';
import Studio from '@/features/filters/studio';
import Year from '@/features/filters/year';

import { cn } from '@/utils/cn';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

const AnimeFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [currentFilters, setCurrentFilters] =
        useState<Partial<Hikka.FilterPreset> | null>(null);
    const search = useRouterState({
        select: (s) => s.location.search,
    }) as Record<string, unknown>;
    const pathname = useRouterState({
        select: (s) => s.location.pathname,
    });

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
    };

    const handleCreateFromCurrent = () => {
        const currentFilters: Partial<Hikka.FilterPreset> = {
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
                currentFilters[key] = values as unknown as NonNullable<
                    Hikka.FilterPreset[typeof key]
                >;
            }
        });

        const arrayNumberKeys = ['years', 'date_range'] as const;
        arrayNumberKeys.forEach((key) => {
            const values = search[key];
            if (Array.isArray(values) && values.length > 0) {
                const numberValues = values.map((v: unknown) => Number(v));
                currentFilters[key] = numberValues as unknown as NonNullable<
                    Hikka.FilterPreset[typeof key]
                >;
            }
        });

        if ('only_translated' in search && search.only_translated != null) {
            currentFilters.only_translated =
                search.only_translated === true ||
                search.only_translated === 'true';
        }
        if (
            'date_range_enabled' in search &&
            search.date_range_enabled != null
        ) {
            currentFilters.date_range_enabled =
                search.date_range_enabled === true ||
                search.date_range_enabled === 'true';
        }

        const sort = search.sort;
        if (Array.isArray(sort) && sort.length > 0) currentFilters.sort = sort;

        const order = search.order;
        if (order) currentFilters.order = order as string;

        if (!currentFilters.content_types) {
            if (pathname.includes('/anime')) {
                currentFilters.content_types = [ContentTypeEnum.ANIME];
            } else if (pathname.includes('/manga')) {
                currentFilters.content_types = [ContentTypeEnum.MANGA];
            } else if (pathname.includes('/novel')) {
                currentFilters.content_types = [ContentTypeEnum.NOVEL];
            }
        }

        setCurrentFilters(currentFilters);
        setOpen(true);
    };

    return (
        <>
            <div className={cn('flex w-full flex-col', className)}>
                <div className="flex flex-col gap-8 overflow-y-auto p-4 py-8">
                    <Genre />
                    <Sort sort_type={sort_type} />
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
                <div className="bg-secondary/20 flex shrink-0 gap-2 border-t p-4">
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
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent
                    className="max-w-xl!"
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

export default AnimeFilters;
