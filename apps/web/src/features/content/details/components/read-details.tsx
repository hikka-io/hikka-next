import { Fragment } from 'react';

import { Building2, Calendar, CircleDashed, Hash, Play } from 'lucide-react';

import type { MangaInfoResponse, NovelInfoResponse } from '@hikka/api';

import { ReleaseStatusBadge } from '@/components/badges';
import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { getMediaTypeLabel } from '@/utils/labels';
import { Link } from '@/utils/navigation';

import DetailItem from './detail-item';
import SynonymsTrigger from './synonyms-trigger';

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
            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<Play className="size-4" />}
                    title="Тип"
                    value={getMediaTypeLabel(data.media_type)}
                />

                <DetailItem
                    title="Статус"
                    icon={<CircleDashed className="size-4" />}
                >
                    {data.status && <ReleaseStatusBadge status={data.status} />}
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
