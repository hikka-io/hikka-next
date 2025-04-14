'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/utils/utils';

import AntDesignClearOutlined from '../../components/icons/ant-design/AntDesignClearOutlined';
import Genre from './prebuilt/genre';
import Localization from './prebuilt/localization';
import MediaType from './prebuilt/media-type';
import ReleaseStatus from './prebuilt/release-status';
import Sort from './prebuilt/sort';
import Year from './prebuilt/year';

interface Props {
    className?: string;
    content_type: API.ContentType;
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
