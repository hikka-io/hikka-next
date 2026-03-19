'use client';

import {
    ContentTypeEnum,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/client';
import { BookType, Building2, CircleDashed, Hash, Play } from 'lucide-react';
import { Fragment } from 'react';

import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
        <Card className={cn('bg-secondary/20 px-0 backdrop-blur', className)}>
            {/* Basic Info Section */}
            <div className="flex flex-col gap-4 px-4">
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
            </div>

            {/* Chapters Info Section */}
            {(data.chapters || data.volumes) && (
                <Fragment>
                    <Separator />
                    <div className="flex flex-col gap-4 px-4">
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
                    </div>
                </Fragment>
            )}

            {/* Additional Info Section */}
            {data.magazines.length > 0 && (
                <Fragment>
                    <Separator />
                    <div className="flex flex-col gap-4 px-4">
                        <DetailItem
                            icon={<Building2 className="size-4" />}
                            title="Видавець"
                            value={data.magazines
                                .map((magazine) => magazine.name_en)
                                .join(', ')}
                        />
                    </div>
                </Fragment>
            )}

            {data.synonyms.length > 0 && (
                <Fragment>
                    <Separator />
                    <div className="flex flex-col gap-4 px-4">
                        <DetailItem
                            icon={<BookType className="size-4" />}
                            title="Синоніми"
                            value={data.synonyms}
                        />
                    </div>
                </Fragment>
            )}
        </Card>
    );
};

export default ReadDetails;
