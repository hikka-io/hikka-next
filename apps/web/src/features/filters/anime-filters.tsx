'use client';

import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { CustomCopyAddRounded } from '@/components/icons/custom/CustomCopyAddRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import AgeRating from '@/features/filters/components/prebuilt/age-rating';
import DateRange from '@/features/filters/components/prebuilt/date-range';
import Genre from '@/features/filters/components/prebuilt/genre';
import Localization from '@/features/filters/components/prebuilt/localization';
import MediaType from '@/features/filters/components/prebuilt/media-type';
import ReleaseStatus from '@/features/filters/components/prebuilt/release-status';
import Score from '@/features/filters/components/prebuilt/score';
import Season from '@/features/filters/components/prebuilt/season';
import Sort from '@/features/filters/components/prebuilt/sort';
import Studio from '@/features/filters/components/prebuilt/studio';
import Year from '@/features/filters/components/prebuilt/year';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';

import { FilterPresetEditModal } from '../modals';

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
            <div className="flex flex-col gap-8 overflow-y-auto p-4 py-8 styled-scrollbar">
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
                            <P className="text-sm">
                                Створити пресет з поточних фільтрів
                            </P>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </div>
        </div>
    );
};

export default AnimeFilters;
