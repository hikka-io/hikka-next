import { Fragment } from 'react';

import {
    Building2,
    Calendar,
    CalendarClock,
    CircleDashed,
    Clock8,
    Hash,
    Play,
    ShieldEllipsis,
} from 'lucide-react';

import type { AnimeInfoResponse } from '@hikka/api';
import {
    AGE_RATING,
    findNextEpisode,
    formatEpisodeCount,
    formatEpisodeDuration,
    formatNextEpisodeDate,
    getMediaTypeLabel,
    getScheduleDuration,
    SEASON,
} from '@hikka/core';

import { ReleaseStatusBadge } from '@/components/badges';
import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import DetailItem from './detail-item';
import SynonymsTrigger from './synonyms-trigger';

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
            <TooltipTrigger
                render={
                    <span className="line-clamp-2 cursor-text select-auto font-medium text-sm leading-tight" />
                }
            >
                {formatNextEpisodeDate(schedule.airing_at)}
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
            <p className="line-clamp-2 flex-1 font-medium text-sm leading-tight hover:underline">
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

const WatchDetails = ({
    className,
    data,
}: {
    className?: string;
    data: AnimeInfoResponse;
}) => {
    const title = useTitle(data);

    const nextEpisodeSchedule = findNextEpisode(data.schedule);
    const studio = data.companies.find((c) => c.type === 'studio');

    const seasonLabel = data.season
        ? (SEASON[data.season as keyof typeof SEASON]?.title_ua ?? data.season)
        : null;

    return (
        <Card className={cn('px-0', className)} id="watch-details">
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

                {seasonLabel && (
                    <DetailItem
                        title="Сезон/рік"
                        icon={<Calendar className="size-4" />}
                    >
                        <Link
                            className="line-clamp-1 font-medium text-sm hover:underline"
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

            <div className="flex flex-col gap-4 px-4">
                <DetailItem
                    icon={<ShieldEllipsis className="size-4" />}
                    title="Рейтинг"
                    value={
                        data.rating
                            ? AGE_RATING[data.rating as keyof typeof AGE_RATING]
                                  .title_ua
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
