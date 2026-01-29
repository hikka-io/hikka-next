'use client';

import { ReadContentType } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import Genre from '@/features/filters/components/prebuilt/genre';
import Localization from '@/features/filters/components/prebuilt/localization';
import MediaType from '@/features/filters/components/prebuilt/media-type';
import ReleaseStatus from '@/features/filters/components/prebuilt/release-status';
import Score from '@/features/filters/components/prebuilt/score';
import Sort from '@/features/filters/components/prebuilt/sort';
import Year from '@/features/filters/components/prebuilt/year';

import { cn } from '@/utils/cn';

interface Props {
    className?: string;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
}

const ReadFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    const router = useRouter();
    const pathname = usePathname();

    const clearFilters = () => {
        router.replace(`${pathname}`);
        // setSelectingYears(YEARS.map((y) => String(y)));
    };

    return (
        <ScrollArea
            className={cn(
                'flex h-full flex-col lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="mt-4 flex flex-col md:mt-0">
                <ReleaseStatus />
                <Genre />
                <MediaType content_type={content_type} />
                <Localization />
                <Sort sort_type={sort_type} />
                {(sort_type === 'manga' || sort_type === 'novel') && <Score />}
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
        </ScrollArea>
    );
};

export default ReadFilters;
