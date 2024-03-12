import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded';

import { ImageResponse } from 'next/og';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';

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
                tw="flex flex-col text-sm text-white w-full h-full p-16 text-center justify-center items-center bg-black"
                style={{
                    background:
                        'linear-gradient(180deg, #160820 0%, #000 60%, #000 100%)',
                }}
            >
                <div
                    tw="flex w-full items-center justify-center"
                    style={{
                        gap: 32,
                    }}
                >
                    <div tw="flex w-[297px]">
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
                        tw="flex flex-col w-full flex-1 border rounded-lg"
                        style={{
                            gap: 16,
                        }}
                    >
                        <div
                            tw="flex flex-col items-start justify-start"
                            style={{ gap: 16 }}
                        >
                            <div
                                tw="flex items-start justify-between w-full"
                                style={{ gap: 16 }}
                            >
                                <h1
                                    tw="text-4xl font-semibold leading-snug text-left m-0"
                                    style={{ fontFamily: 'Fixel' }}
                                >
                                    {anime.title_ua ||
                                        anime.title_en ||
                                        anime.title_ja}{' '}
                                </h1>
                                {anime.score > 0 && (
                                    <div
                                        tw="flex items-start justify-start leading-none m-0 p-0 "
                                        style={{ gap: 4 }}
                                    >
                                        <h1
                                            tw="font-semibold text-6xl text-right m-0 p-0"
                                            style={{
                                                fontFamily: 'Fixel',
                                            }}
                                        >
                                            {anime.score}
                                        </h1>
                                        <MaterialSymbolsStarRounded
                                            style={{ width: 36, height: 36 }}
                                        />
                                    </div>
                                )}
                            </div>
                            <h2 tw="text-zinc-400 m-0">{anime.title_ja}</h2>
                        </div>

                        <div tw="flex items-center" style={{ gap: 16 }}>
                            {anime.genres.slice(0, 5).map((genre, i) =>
                                i < 8 ? (
                                    <div
                                        key={genre.slug}
                                        style={{
                                            fontFamily: 'Inter',
                                            borderColor: 'rgba(39,39,42,0.6)',
                                            backgroundColor:
                                                'rgba(39,39,42,0.3)',
                                        }}
                                        tw="flex rounded-full border py-1 px-4 text-lg"
                                    >
                                        {genre.name_ua || genre.name_en}
                                    </div>
                                ) : null,
                            )}
                        </div>
                        <div
                            tw="flex border rounded-lg p-4 items-center"
                            style={{
                                borderColor: 'rgba(39,39,42,0.6)',
                                backgroundColor: 'rgba(39,39,42,0.3)',
                            }}
                        >
                            <div tw="flex flex-col flex-1" style={{ gap: 16 }}>
                                {anime.media_type && (
                                    <div tw="flex flex-nowrap items-center">
                                        <div tw="flex w-26">
                                            <p
                                                tw="text-zinc-400 text-xl m-0"
                                                style={{ fontFamily: 'Inter' }}
                                            >
                                                Тип:
                                            </p>
                                        </div>
                                        <div tw="flex">
                                            <p
                                                style={{ fontFamily: 'Inter' }}
                                                tw="text-xl font-bold m-0"
                                            >
                                                {
                                                    MEDIA_TYPE[anime.media_type]
                                                        .title_ua
                                                }
                                            </p>
                                        </div>
                                        <div
                                            tw="flex rounded-lg h-6 px-2 ml-4 items-center justify-center text-xl"
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
                                                    tw="text-left text-zinc-400 text-xl m-0"
                                                >
                                                    Епізоди:
                                                </p>
                                            </div>
                                            <div tw="flex flex-1">
                                                <p
                                                    tw="text-xl m-0"
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
                            </div>
                            {studio && studio.company.image && (
                                <div tw="flex overflow-hidden rounded-lg w-[100px] h-[100px]">
                                    <img
                                        src={studio.company.image}
                                        alt="studio"
                                        width={100}
                                        height={100}
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
            width: 1200,
            height: 630,
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
