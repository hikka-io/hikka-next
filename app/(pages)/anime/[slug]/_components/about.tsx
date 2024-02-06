'use client';

import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import SubHeader from '@/app/_components/sub-header';
import { Label } from '@/app/_components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/app/_components/ui/tooltip';
import { AGE_RATING, MEDIA_TYPE, RELEASE_STATUS } from '@/app/_utils/constants';


const Component = () => {
    const params = useParams();

    const { data } = useAnimeInfo(String(params.slug));

    if (!data) {
        return null;
    }

    const studio = data.companies.find((c) => c.type === 'studio');

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
                            className="w-fit rounded-md px-2"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[data.status].color,
                            }}
                        >
                            <p className="text-sm !text-white">
                                {RELEASE_STATUS[data.status].title_ua}
                            </p>
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
                                        <p className="text-sm">
                                            {studio.company.name}
                                        </p>
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

export default Component;