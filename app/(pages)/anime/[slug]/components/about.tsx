'use client';

import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import { AGE_RATING, MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';


const About = () => {
    const params = useParams();

    const { data } = useAnimeInfo({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    const studio = data.companies.find((c) => c.type === 'studio');
    const nextEpisodeSchedule = data.schedule?.find(
        (s) => s.airing_at * 1000 > Date.now(),
    );

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Деталі" />
            <div className="flex flex-col gap-4 rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                {data.media_type && (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <Label className="text-muted-foreground">
                                Тип:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label>
                                {MEDIA_TYPE[data.media_type].title_ua}
                            </Label>
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap items-center">
                    <div className="w-24">
                        <Label className="text-muted-foreground">Статус:</Label>
                    </div>
                    <div className="flex-1">
                        <div
                            className="w-fit rounded-sm px-2"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[data.status].color,
                            }}
                        >
                            <P className="text-sm text-white">
                                {RELEASE_STATUS[data.status].title_ua}
                            </P>
                        </div>
                    </div>
                </div>
                {data.media_type !== 'movie' &&
                data.episodes_total &&
                data.episodes_released !== null ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <Label className="text-muted-foreground">
                                Епізоди:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label>
                                {data.status === 'finished'
                                    ? data.episodes_total
                                    : `${data.episodes_released} / ${data.episodes_total}`}
                            </Label>
                        </div>
                    </div>
                ) : null}
                {nextEpisodeSchedule ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <Label className="text-muted-foreground">
                                Наступний епізод:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Tooltip>
                                <TooltipTrigger>
                                    <Label>
                                        {format(
                                            new Date(
                                                nextEpisodeSchedule.airing_at *
                                                    1000,
                                            ),
                                            'd MMMM HH:mm',
                                        )}
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <P>
                                        {formatDuration(
                                            intervalToDuration({
                                                start:
                                                    nextEpisodeSchedule.airing_at *
                                                    1000,
                                                end: Date.now(),
                                            }),
                                        )}
                                    </P>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                ) : null}
                {data.duration ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <Label className="text-muted-foreground">
                                Тривалість епізоду:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label>
                                {formatDuration(
                                    intervalToDuration({
                                        start: 0,
                                        end: data.duration * 60 * 1000,
                                    }),
                                )}
                            </Label>
                        </div>
                    </div>
                ) : null}

                {data.rating ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <Label className="text-muted-foreground">
                                Рейтинг:
                            </Label>
                        </div>
                        <div className="flex-1">
                            <Label>{AGE_RATING[data.rating].title_ua}</Label>
                        </div>
                    </div>
                ) : null}
                {studio ? (
                    <div className="flex flex-wrap">
                        <div className="w-24">
                            <Label className="text-muted-foreground">
                                Студія:
                            </Label>
                        </div>
                        <div className="flex-1">
                            {studio.company.image ? (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <Image
                                            src={studio.company.image}
                                            alt="studio"
                                            width={100}
                                            height={50}
                                            className="w-16 rounded-md object-cover"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <P className="text-sm">
                                            {studio.company.name}
                                        </P>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Label>{studio.company.name}</Label>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default About;
