import { Fragment, useState } from 'react';

import {
    BookType,
    Building2,
    Calendar,
    CircleDashed,
    Hash,
    Play,
} from 'lucide-react';

import {
    ContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
} from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';
import {
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
    RELEASE_STATUS,
} from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

import DetailItem from './detail-item';
import SynonymsModal from './synonyms-modal';

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

const SynonymsTrigger = ({
    synonyms,
    title,
}: {
    synonyms: string[];
    title?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DetailItem icon={<BookType className="size-4" />} title="Синоніми">
                <button
                    type="button"
                    className="line-clamp-2 w-fit cursor-pointer text-right font-medium text-sm leading-tight hover:underline"
                    onClick={() => setOpen(true)}
                >
                    {synonyms.slice(0, 3).join(', ')}
                </button>
            </DetailItem>
            <SynonymsModal
                description={title}
                synonyms={synonyms}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
};

const ReadDetails = ({
    className,
    data,
}: {
    className?: string;
    data: MangaInfoResponse | NovelInfoResponse;
}) => {
    const title = useTitle(data);

    return (
        <Card className={cn('px-0', className)} id="read-details">
            {/* Basic Info Section */}
            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<Play className="size-4" />}
                    title="Тип"
                    value={
                        data.media_type
                            ? data.data_type === ContentTypeEnum.MANGA
                                ? MANGA_MEDIA_TYPE[
                                      data.media_type as keyof typeof MANGA_MEDIA_TYPE
                                  ].title_ua
                                : NOVEL_MEDIA_TYPE[
                                      data.media_type as keyof typeof NOVEL_MEDIA_TYPE
                                  ].title_ua
                            : undefined
                    }
                />

                <DetailItem
                    title="Статус"
                    icon={<CircleDashed className="size-4" />}
                >
                    {data.status && <StatusBadge status={data.status} />}
                </DetailItem>

                {!!data.year && (
                    <DetailItem
                        title="Рік"
                        icon={<Calendar className="size-4" />}
                    >
                        <Link
                            className="line-clamp-1 font-medium text-sm hover:underline"
                            to={`/${data.data_type}`}
                            search={{
                                years: [data.year, data.year],
                            }}
                        >
                            {data.year}
                        </Link>
                    </DetailItem>
                )}
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
                        <SynonymsTrigger
                            title={title}
                            synonyms={data.synonyms}
                        />
                    </div>
                </Fragment>
            )}
        </Card>
    );
};

export default ReadDetails;
