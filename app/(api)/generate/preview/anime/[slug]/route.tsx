import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import { uk } from 'date-fns/locale';

import { ImageResponse } from 'next/og';

import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import { AGE_RATING, MEDIA_TYPE, RELEASE_STATUS } from '@/app/_utils/constants';

export const runtime = 'edge';

export async function GET(
    request: Request,
    { params: { slug } }: { params: { slug: string } },
) {
    const fixel = await fetch(
        new URL('/fonts/FixelDisplay-SemiBold.otf', import.meta.url),
    ).then((res) => res.arrayBuffer());
    const inter = await fetch(
        new URL('/fonts/Inter-Regular.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    const anime = await getAnimeInfo({ slug });
    const studio = anime.companies.find((c) => c.type === 'studio');

    return new ImageResponse(
        (
            <div
                tw="flex flex-col text-sm text-white w-full h-full p-8 text-center justify-center items-center"
                style={{
                    background:
                        'linear-gradient(180deg, #160820 0%, #000 60%, #000 100%)',
                }}
            >
                <div
                    tw="flex w-full h-full items-start gap-8"
                    style={{ gap: 32 }}
                >
                    <div tw="flex gap-8 w-[297px]">
                        <div
                            tw="flex relative w-full rounded-lg overflow-hidden bg-zinc-900"
                            style={{
                                paddingTop: '140%',
                            }}
                        >
                            <img
                                tw="absolute top-0 left-0"
                                src={anime.poster}
                                width={297}
                                height={416}
                                alt="poster"
                            />
                        </div>
                    </div>
                    <div
                        tw="flex flex-col w-full h-full flex-1"
                        style={{ gap: 16 }}
                    >
                        <div tw="flex" style={{ gap: 32 }}>
                            <h1
                                tw="text-2xl font-semibold flex-1 text-left"
                                style={{ fontFamily: 'Fixel' }}
                            >
                                {anime.title_ua ||
                                    anime.title_en ||
                                    anime.title_ja}
                            </h1>
                            <h1
                                tw="text-4xl font-semibold text-right"
                                style={{ fontFamily: 'Fixel' }}
                            >
                                {anime.score ? anime.score : null}
                            </h1>
                        </div>
                        <div tw="flex" style={{ gap: 16 }}>
                            {anime.genres.map((genre, i) =>
                                i < 8 ? (
                                    <div
                                        key={genre.slug}
                                        style={{
                                            fontFamily: 'Inter',
                                            borderColor: 'rgba(39,39,42,0.6)',
                                            backgroundColor:
                                                'rgba(39,39,42,0.3)',
                                        }}
                                        tw="flex rounded-full border py-1 px-4"
                                    >
                                        {genre.name_ua || genre.name_en}
                                    </div>
                                ) : null,
                            )}
                        </div>
                        <div
                            tw="flex rounded-lg border py-4 px-4"
                            style={{
                                borderColor: 'rgba(39,39,42,0.6)',
                                backgroundColor: 'rgba(39,39,42,0.3)',
                            }}
                        >
                            <div tw="flex flex-col flex-1">
                                {anime.media_type && (
                                    <div tw="flex flex-nowrap items-center">
                                        <div tw="flex w-26">
                                            <p
                                                tw="text-zinc-400 text-base"
                                                style={{ fontFamily: 'Inter' }}
                                            >
                                                Тип:
                                            </p>
                                        </div>
                                        <div tw="flex">
                                            <p
                                                style={{ fontFamily: 'Inter' }}
                                                tw="text-base font-bold"
                                            >
                                                {
                                                    MEDIA_TYPE[anime.media_type]
                                                        .title_ua
                                                }
                                            </p>
                                        </div>
                                        <div
                                            tw="flex rounded-lg h-6 px-2 ml-4 items-center justify-center text-base"
                                            style={{
                                                fontFamily: 'Inter',
                                                backgroundColor:
                                                    RELEASE_STATUS[anime.status]
                                                        .color,
                                            }}
                                        >
                                            {
                                                RELEASE_STATUS[anime.status]
                                                    .title_ua
                                            }
                                        </div>
                                    </div>
                                )}
                                {anime.media_type !== 'movie' &&
                                    anime.episodes_total &&
                                    anime.episodes_released !== null && (
                                        <div tw="flex flex-wrap">
                                            <div tw="flex w-26">
                                                <p
                                                    style={{
                                                        fontFamily: 'Inter',
                                                    }}
                                                    tw="text-left text-zinc-400 text-base"
                                                >
                                                    Епізоди:
                                                </p>
                                            </div>
                                            <div tw="flex flex-1">
                                                <p
                                                    tw="text-base"
                                                    style={{
                                                        fontFamily: 'Inter',
                                                    }}
                                                >
                                                    {anime.status === 'finished'
                                                        ? anime.episodes_total
                                                        : `${anime.episodes_released} / ${anime.episodes_total}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                {anime.rating && (
                                    <div tw="flex flex-nowrap items-center">
                                        <div tw="flex w-26">
                                            <p
                                                style={{ fontFamily: 'Inter' }}
                                                tw="text-left text-zinc-400 text-base"
                                            >
                                                Рейтинг:
                                            </p>
                                        </div>
                                        <div tw="flex">
                                            <p
                                                style={{ fontFamily: 'Inter' }}
                                                tw="text-base"
                                            >
                                                {
                                                    AGE_RATING[anime.rating]
                                                        .title_ua
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {anime.duration && (
                                    <div tw="flex flex-nowrap items-start">
                                        <div tw="flex w-26 text-left">
                                            <p
                                                style={{ fontFamily: 'Inter' }}
                                                tw="text-left text-zinc-400 text-base"
                                            >
                                                Тривалість епізоду:
                                            </p>
                                        </div>
                                        <div tw="flex">
                                            <p
                                                style={{ fontFamily: 'Inter' }}
                                                tw="text-base"
                                            >
                                                {formatDuration(
                                                    intervalToDuration({
                                                        start: 0,
                                                        end:
                                                            anime.duration *
                                                            60 *
                                                            1000,
                                                    }),
                                                    {
                                                        locale: uk,
                                                    },
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {studio && studio.company.image && (
                                <div tw="flex overflow-hidden rounded-lg w-[200px] h-[200px]">
                                    <img
                                        src={studio.company.image}
                                        alt="studio"
                                        width={200}
                                        height={200}
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1112,
            height: 480,
            fonts: [
                {
                    name: 'Fixel',
                    data: fixel,
                    style: 'normal',
                    weight: 600,
                },
                {
                    name: 'Inter',
                    data: inter,
                    style: 'normal',
                    weight: 400,
                },
            ],
        },
    );
}