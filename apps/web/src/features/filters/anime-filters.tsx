'use client';

import { ContentTypeEnum } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import AgeRating from '@/features/filters/components/prebuilt/age-rating';
import DateRange from '@/features/filters/components/prebuilt/date-range';
import Genre from '@/features/filters/components/prebuilt/genre';
import Localization from '@/features/filters/components/prebuilt/localization';
import MediaType from '@/features/filters/components/prebuilt/media-type';
import ReleaseStatus from '@/features/filters/components/prebuilt/release-status';
import Season from '@/features/filters/components/prebuilt/season';
import Sort from '@/features/filters/components/prebuilt/sort';
import Studio from '@/features/filters/components/prebuilt/studio';
import Year from '@/features/filters/components/prebuilt/year';

import { cn } from '@/utils/utils';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

const AnimeFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    const router = useRouter();
    const pathname = usePathname();

    const clearFilters = () => {
        router.replace(`${pathname}`);
        // setSelectingYears(YEARS.map((y) => String(y)));
    };

    return (
        <div
            className={cn(
                'no-scrollbar h-full overflow-x-scroll lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="mt-4 flex flex-col md:mt-0">
                <ReleaseStatus />
                <Season />
                <Year />
                {sort_type === 'anime' && <DateRange />}
                <Genre />
                <MediaType content_type={content_type} />
                <Localization />
                <Sort sort_type={sort_type} />
                <AgeRating />
                <Studio />
            </div>
            <Button
                variant="secondary"
                className="my-4 w-full md:mt-4 lg:flex"
                onClick={clearFilters}
                asChild
            >
                <Link href={pathname}>
                    <AntDesignClearOutlined /> Очистити
                </Link>
            </Button>
        </div>
    );
};

export default AnimeFilters;
