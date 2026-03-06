'use client';

import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import AgeRating from '@/components/filters/age-rating';
import DateRange from '@/components/filters/date-range';
import Genre from '@/components/filters/genre';
import Localization from '@/components/filters/localization';
import MediaType from '@/components/filters/media-type';
import ReleaseStatus from '@/components/filters/release-status';
import Score from '@/components/filters/score';
import Season from '@/components/filters/season';
import Sort from '@/components/filters/sort';
import Studio from '@/components/filters/studio';
import Year from '@/components/filters/year';
import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { CustomCopyAddRounded } from '@/components/icons/custom/CustomCopyAddRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { FilterPresetEditModal } from '@/features/content';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

const AnimeFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    const { closeModal, openModal } = useModalContext();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const clearFilters = () => {
        router.replace(`${pathname}`);
        // setSelectingYears(YEARS.map((y) => String(y)));
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
            const values = searchParams.getAll(key);
            if (values.length > 0) {
                currentFilters[key] = values as unknown as NonNullable<
                    Hikka.FilterPreset[typeof key]
                >;
            }
        });

        const arrayNumberKeys = ['years', 'date_range'] as const;
        arrayNumberKeys.forEach((key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) {
                const numberValues = values.map((v) => Number(v));
                currentFilters[key] = numberValues as unknown as NonNullable<
                    Hikka.FilterPreset[typeof key]
                >;
            }
        });

        if (searchParams.has('only_translated')) {
            currentFilters.only_translated =
                searchParams.get('only_translated') === 'true';
        }
        if (searchParams.has('date_range_enabled')) {
            currentFilters.date_range_enabled =
                searchParams.get('date_range_enabled') === 'true';
        }

        const sort = searchParams.getAll('sort');
        if (sort.length > 0) currentFilters.sort = sort;

        const order = searchParams.get('order');
        if (order) currentFilters.order = order;

        if (!currentFilters.content_types) {
            if (pathname.includes('/anime')) {
                currentFilters.content_types = [ContentTypeEnum.ANIME];
            } else if (pathname.includes('/manga')) {
                currentFilters.content_types = [ContentTypeEnum.MANGA];
            } else if (pathname.includes('/novel')) {
                currentFilters.content_types = [ContentTypeEnum.NOVEL];
            }
        }

        openModal({
            content: (
                <FilterPresetEditModal
                    filterPreset={currentFilters as Hikka.FilterPreset}
                />
            ),
            className: '!max-w-xl',
            title: 'Створити пресет з поточних',
            forceModal: true,
        });
    };

    return (
        <div className={cn('flex flex-col w-full', className)}>
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
            <div className="p-4 bg-secondary/30 border-t border-secondary/60 shrink-0 flex gap-2">
                <Button
                    size="md"
                    className="flex-1"
                    variant="destructive"
                    onClick={clearFilters}
                    asChild
                >
                    <Link href={pathname}>
                        <AntDesignClearOutlined /> Очистити
                    </Link>
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
    );
};

export default AnimeFilters;
