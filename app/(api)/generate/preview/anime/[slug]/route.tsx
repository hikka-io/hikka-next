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
                tw="flex flex-col text-sm text-white w-full h-full p-16 text-center justify-center items-end bg-black"
                style={{
                    background:
                        'linear-gradient(270deg, #160820 0%, #000 90%, #000 100%)',
                    gap: 32,
                }}
            >
                <div
                    tw="flex w-full items-center justify-center border-2 backdrop-blur-lg bg-black rounded-xl overflow-hidden"
                    style={{
                        borderColor: 'rgba(39,39,42,0.6)',
                    }}
                >
                    <div tw="flex w-[297px]">
                        <div
                            tw="flex relative w-full rounded-lg rounded-r-none overflow-hidden bg-zinc-900"
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
                        tw="flex flex-col w-full flex-1 py-4 px-8"
                        style={{
                            gap: 24,
                        }}
                    >
                        <div
                            tw="flex flex-col items-start justify-start"
                            style={{ gap: 16 }}
                        >
                            <div
                                tw="flex items-center justify-between w-full"
                                style={{ gap: 16 }}
                            >
                                <h1
                                    tw="text-4xl font-semibold leading-snug text-left m-0"
                                    style={{ fontFamily: 'Fixel' }}
                                >
                                    {anime.title_ua ||
                                        anime.title_en ||
                                        anime.title_ja}
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
                <svg width="87.75" height="26.25" viewBox="0 0 117 35" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.8608 10.5571C17.5403 10.5571 19.6896 11.4453 21.3085 13.2217C22.9274 14.9703 23.7368 17.385 23.7368 20.4659V34.0384H16.6192V21.4235C16.6192 19.8691 16.2145 18.6618 15.4051 17.8013C14.5956 16.9409 13.507 16.5107 12.1393 16.5107C10.7717 16.5107 9.68309 16.9409 8.87363 17.8013C8.06417 18.6618 7.65945 19.8691 7.65945 21.4235V34.0384H0.5V3.22959H7.65945V13.9294C8.38518 12.9025 9.37605 12.0837 10.6321 11.473C11.8881 10.8624 13.2977 10.5571 14.8608 10.5571ZM32.3126 8.39216C31.0565 8.39216 30.0238 8.03134 29.2143 7.30968C28.4328 6.56028 28.042 5.64434 28.042 4.56187C28.042 3.45164 28.4328 2.5357 29.2143 1.81405C30.0238 1.06464 31.0565 0.689941 32.3126 0.689941C33.5408 0.689941 34.5457 1.06464 35.3271 1.81405C36.1367 2.5357 36.5413 3.45164 36.5413 4.56187C36.5413 5.64434 36.1367 6.56028 35.3271 7.30968C34.5457 8.03134 33.5408 8.39216 32.3126 8.39216ZM35.8714 10.8069V34.0384H28.7119V10.8069H35.8714ZM55.3368 34.0384L48.2192 24.2962V34.0384H41.0598V3.22959H48.2192V20.2577L55.2949 10.8069H64.1291L54.4157 22.4643L64.2128 34.0384H55.3368ZM81.2182 34.0384L74.1006 24.2962V34.0384H66.9411V3.22959H74.1006V20.2577L81.1763 10.8069H90.0105L80.2971 22.4643L90.0942 34.0384H81.2182ZM91.399 22.381C91.399 19.994 91.8455 17.8985 92.7388 16.0944C93.6599 14.2902 94.9019 12.9025 96.465 11.931C98.0282 10.9596 99.7726 10.4738 101.699 10.4738C103.345 10.4738 104.783 10.8069 106.011 11.473C107.267 12.1392 108.23 13.0135 108.9 14.096V10.8069H116.059V34.0384H108.9V30.7494C108.202 31.8319 107.225 32.7062 105.969 33.3723C104.741 34.0384 103.304 34.3715 101.657 34.3715C99.7586 34.3715 98.0282 33.8859 96.465 32.9143C94.9019 31.9151 93.6599 30.5135 92.7388 28.7093C91.8455 26.8775 91.399 24.768 91.399 22.381ZM108.9 22.4227C108.9 20.6463 108.397 19.2446 107.393 18.2177C106.416 17.1907 105.215 16.6772 103.792 16.6772C102.368 16.6772 101.154 17.1907 100.149 18.2177C99.1724 19.2169 98.684 20.6047 98.684 22.381C98.684 24.1574 99.1724 25.5729 100.149 26.6277C101.154 27.6546 102.368 28.1681 103.792 28.1681C105.215 28.1681 106.416 27.6546 107.393 26.6277C108.397 25.6007 108.9 24.199 108.9 22.4227Z"
                        fill="white" />
                </svg>
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
