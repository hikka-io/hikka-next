'use client';

import { AnimeInfoResponse, AnimeStatusEnum } from '@hikka/client';
import { useTitle } from '@hikka/react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import {
    BookType,
    Building2,
    Calendar,
    CalendarClock,
    CircleDashed,
    Clock8,
    Hash,
    Play,
    ShieldEllipsis,
} from 'lucide-react';
import { Fragment, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/cn';
import {
    AGE_RATING,
    ANIME_MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants/common';
import { getScheduleDuration } from '@/utils/i18n';
import { Link } from '@/utils/navigation';

import DetailItem from './detail-item';
import SynonymsModal from './synonyms-modal';

// Utility functions
const formatEpisodeDuration = (duration: number) =>
    formatDuration(
        intervalToDuration({
            start: 0,
            end: duration * 60 * 1000,
        }),
    );

const formatEpisodeCount = (
    status: string,
    episodesReleased: number | null,
    episodesTotal: number | null,
) => {
    if (status === AnimeStatusEnum.FINISHED) {
        return episodesTotal?.toString() ?? '?';
    }
    return `${episodesReleased ?? '?'} / ${episodesTotal ?? '?'}`;
};

const formatNextEpisodeDate = (airingAt: number) =>
    format(new Date(airingAt * 1000), 'd MMMM HH:mm');

// Component helpers
const NextEpisodeDetail = ({
    schedule,
}: {
    schedule: { airing_at: number };
}) => (
    <DetailItem
        icon={<CalendarClock className="size-4" />}
        title="Наступний епізод"
    >
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="line-clamp-2 cursor-text text-sm leading-tight font-medium select-auto">
                    {formatNextEpisodeDate(schedule.airing_at)}
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{getScheduleDuration(schedule.airing_at)}</p>
            </TooltipContent>
        </Tooltip>
    </DetailItem>
);

const StudioDetail = ({
    studio,
}: {
    studio: { company: { name: string; slug: string; image?: string | null } };
}) => (
    <DetailItem
        title="Студія"
        icon={<Building2 className="size-4" />}
        className="grid-cols-[1fr_60%]"
    >
        <div className="flex flex-1 items-start gap-2">
            <p className="line-clamp-2 flex-1 text-sm leading-tight font-medium hover:underline">
                <Link to="/anime" search={{ studios: studio.company.slug }}>
                    {studio.company.name}
                </Link>
            </p>
            {studio.company.image && (
                <Link to="/anime" search={{ studios: studio.company.slug }}>
                    <img
                        src={studio.company.image}
                        alt="studio"
                        width={100}
                        height={50}
                        className="w-8 rounded-sm object-cover"
                        loading="lazy"
                    />
                </Link>
            )}
        </div>
    </DetailItem>
);

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
                    className="line-clamp-2 w-fit cursor-pointer text-right text-sm leading-tight font-medium hover:underline"
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

const WatchDetails = ({
    className,
    data,
}: {
    className?: string;
    data: AnimeInfoResponse;
}) => {
    const title = useTitle(data);

    const nextEpisodeSchedule = data.schedule.find(
        (s) => s.airing_at * 1000 > Date.now(),
    );
    const studio = data.companies.find((c) => c.type === 'studio');

    const seasonLabel = data.season
        ? (SEASON[data.season as keyof typeof SEASON]?.title_ua ?? data.season)
        : null;

    return (
        <Card
            className={cn('bg-secondary/20 px-0 backdrop-blur', className)}
            id="watch-details"
        >
            {/* Basic Info Section */}
            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<Play className="size-4" />}
                    title="Тип"
                    value={
                        data.media_type
                            ? ANIME_MEDIA_TYPE[data.media_type].title_ua
                            : undefined
                    }
                />

                <DetailItem
                    title="Статус"
                    icon={<CircleDashed className="size-4" />}
                >
                    {data.status && <StatusBadge status={data.status} />}
                </DetailItem>

                {seasonLabel && (
                    <DetailItem
                        title="Сезон/рік"
                        icon={<Calendar className="size-4" />}
                    >
                        <Link
                            className="line-clamp-1 text-sm font-medium hover:underline"
                            to="/anime"
                            search={{
                                seasons: [data.season],
                                years: [data.year, data.year],
                            }}
                        >
                            {`${seasonLabel} ${data.year}`}
                        </Link>
                    </DetailItem>
                )}
            </div>

            {/* Episode Info Section */}
            {Boolean(data.episodes_total || data.episodes_released) && (
                <Fragment>
                    <Separator />
                    <div className="flex flex-col gap-4 px-4">
                        <DetailItem
                            icon={<Hash className="size-4" />}
                            title="Епізоди"
                            value={
                                (data.episodes_total ||
                                    data.episodes_released) &&
                                (data.media_type !== 'movie' ||
                                    (data.episodes_total ??
                                        data.episodes_released ??
                                        0) > 1)
                                    ? formatEpisodeCount(
                                          data.status!,
                                          data.episodes_released,
                                          data.episodes_total,
                                      )
                                    : undefined
                            }
                        />

                        {nextEpisodeSchedule && (
                            <NextEpisodeDetail schedule={nextEpisodeSchedule} />
                        )}

                        <DetailItem
                            icon={<Clock8 className="size-4" />}
                            title="Тривалість епізоду"
                            value={
                                data.duration
                                    ? formatEpisodeDuration(data.duration)
                                    : undefined
                            }
                        />
                    </div>
                </Fragment>
            )}

            <Separator />

            {/* Additional Info Section */}
            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<ShieldEllipsis className="size-4" />}
                    title="Рейтинг"
                    value={
                        data.rating
                            ? AGE_RATING[data.rating].title_ua
                            : undefined
                    }
                />

                {studio && <StudioDetail studio={studio} />}
            </div>

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

export default WatchDetails;
