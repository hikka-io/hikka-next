'use client';

import { ReadContentType } from '@hikka/client';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { Button } from '@/components/ui/button';

import Genre from '@/features/filters/genre';
import Localization from '@/features/filters/localization';
import MediaType from '@/features/filters/media-type';
import ReleaseStatus from '@/features/filters/release-status';
import Score from '@/features/filters/score';
import Sort from '@/features/filters/sort';
import Year from '@/features/filters/year';

import { cn } from '@/utils/cn';

interface Props {
    className?: string;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
}

const ReadFilters: FC<Props> = ({ className, content_type, sort_type }) => {
    const router = useRouter();

    const clearFilters = () => {
        router.navigate({ search: {}, replace: true } as any);
    };

    return (
        <div className={cn('-m-4 flex flex-col lg:m-0', className)}>
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
            <div className="bg-secondary/20 flex shrink-0 gap-2 border-t p-4">
                <Button
                    size="md"
                    className="w-full"
                    variant="destructive"
                    onClick={clearFilters}
                >
                    <AntDesignClearOutlined /> Очистити
                </Button>
            </div>
        </div>
    );
};

export default ReadFilters;
