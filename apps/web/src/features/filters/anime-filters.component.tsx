'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '../../components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '../../components/ui/button';
import { cn } from '../../utils/utils';
import AgeRating from './prebuilt/age-rating';
import Genre from './prebuilt/genre';
import Localization from './prebuilt/localization';
import MediaType from './prebuilt/media-type';
import ReleaseStatus from './prebuilt/release-status';
import Season from './prebuilt/season';
import Sort from './prebuilt/sort';
import Studio from './prebuilt/studio';
import Year from './prebuilt/year';

interface Props {
    className?: string;
    content_type: API.ContentType;
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
                <Genre />
                <MediaType content_type={content_type} />
                <Localization />
                <Sort sort_type={sort_type} />
                <AgeRating />
                <Studio />
                <Year />
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
