'use client';

import { ReadContentType } from '@hikka/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

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
    };

    return (
        <div className={cn('flex flex-col w-full', className)}>
            <div className="flex flex-col gap-8 overflow-y-auto p-4 py-8">
                <ReleaseStatus />
                <Genre />
                <MediaType content_type={content_type} />
                <Localization />
                <Sort sort_type={sort_type} />
                {(sort_type === 'manga' || sort_type === 'novel') && (
                    <Score score_type="score" />
                )}
                <Year />
            </div>
            <div className="flex shrink-0 gap-2 border-t border-secondary/60 bg-secondary/30 p-4">
                <Button
                    size="md"
                    className="w-full"
                    variant="destructive"
                    onClick={clearFilters}
                    asChild
                >
                    <Link href={pathname}>
                        <AntDesignClearOutlined /> Очистити
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ReadFilters;
