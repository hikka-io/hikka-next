'use client';

import {
    ContentTypeEnum,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/client';
import { BookType, Building2, CircleDashed, Hash, Play } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';

import { cn } from '@/utils/cn';
import {
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
    RELEASE_STATUS,
} from '@/utils/constants/common';

import DetailItem from './detail-item';

const StatusBadge = ({ status }: { status: string }) => (
    <Badge
        variant="status"
        className={cn(
            `bg-${status} text-${status}-foreground border-${status}-border`,
        )}
    >
        {RELEASE_STATUS[status as keyof typeof RELEASE_STATUS]?.title_ua}
    </Badge>
);

const ReadDetails = ({
    className,
    data,
}: {
    className?: string;
    data: MangaInfoResponse | NovelInfoResponse;
}) => {
    return (
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
            {/* Basic Info Section */}
            <DetailItem
                icon={<Play className="size-4" />}
                title="Тип"
                value={
                    data.media_type
                        ? data.data_type === ContentTypeEnum.MANGA
                            ? MANGA_MEDIA_TYPE[data.media_type].title_ua
                            : NOVEL_MEDIA_TYPE[data.media_type].title_ua
                        : undefined
                }
            />

            <DetailItem
                title="Статус"
                icon={<CircleDashed className="size-4" />}
            >
                {data.status && <StatusBadge status={data.status} />}
            </DetailItem>

            {(data.chapters || data.volumes) && (
                <div className="h-px bg-border" />
            )}

            {/* Chapters Info Section */}
            <DetailItem
                icon={<Hash className="size-4" />}
                title="Розділи"
                value={data.chapters}
            />

            <DetailItem
                icon={<Hash className="size-4" />}
                title="Томи"
                value={data.volumes}
            />

            {data.magazines.length > 0 && <div className="h-px bg-border" />}

            {/* Additional Info Section */}
            <DetailItem
                icon={<Building2 className="size-4" />}
                title="Видавець"
                value={data.magazines
                    .map((magazine) => magazine.name_en)
                    .join(', ')}
            />

            {data.synonyms.length > 0 && <div className="h-px bg-border" />}

            <DetailItem
                icon={<BookType className="size-4" />}
                title="Синоніми"
                value={data.synonyms}
            />
        </Card>
    );
};

export default ReadDetails;
