'use client';

import Slider from '@/app/_components/Slider';
import Select from '@/app/_components/Select';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useRouter from '@/utils/useRouter';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import getAnimeGenres from '@/utils/api/anime/getAnimeGenres';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import AntDesignCloseOutlined from '~icons/ant-design/close-outlined';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';
import {
    AGE_RATING,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants';

const YEARS: [number, number] = [1980, new Date().getFullYear()];

const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('lang');

    const { data: genresList } = useQuery({
        queryKey: ['animeGenres'],
        queryFn: () => getAnimeGenres(),
    });

    const [selectingYears, setSelectingYears] = useState<string[]>(
        years.length > 0 ? years : YEARS.map((y) => String(y)),
    );

    const createQueryString = useCallback(
        (name: string, value: string | string[] | boolean) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');

            if (value) {
                if (Array.isArray(value)) {
                    params.delete(name);
                    value.forEach((v) => params.append(name, String(v)));
                } else {
                    params.set(name, String(value));
                }
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    const handleFilterSelect = (value: string, data: string[]) => {
        const newData = [...data];

        if (!newData.includes(value)) {
            newData.push(value);
        } else {
            newData.splice(newData.indexOf(value), 1);
        }

        return newData;
    };

    const clearFilters = () => {
        router.replace(`${pathname}`);
        setSelectingYears(YEARS.map((y) => String(y)));
    };

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(name, value);
        router.replace(`${pathname}?${query}`);
    };

    useEffect(() => {
        if (JSON.stringify(selectingYears) !== JSON.stringify(years)) {
            setSelectingYears(
                years.length > 0 ? years : YEARS.map((y) => String(y)),
            );
        }
    }, [searchParams]);

    return (
        <div
            className={clsx(
                'flex flex-col items-start gap-8',
                // 'lg:absolute lg:top-0',
                'border-t border-t-transparent',
                'transition',
            )}
        >
            <h3 className="text-white lg:hidden">Фільтри</h3>
            <div className="flex flex-col items-start gap-8 w-full overflow-y-scroll lg:overflow-y-visible">
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-neutral">Жанр</span>
                    </label>
                    {genresList && genresList.list.length > 0 && (
                        <Select
                            placeholder="Виберіть жанр/жанри"
                            multiple
                            toggleClassName="btn-outline btn-secondary"
                            value={genres}
                            onChange={(_e, value) =>
                                handleChangeParam('genres', value as string[])
                            }
                        >
                            {genresList.list.map((genre) => (
                                <Select.Option
                                    key={genre.slug}
                                    value={genre.slug}
                                >
                                    {genre.name_ua || genre.name_en}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </div>
                {/*<div className="form-control w-full">
                    <label className="label cursor-pointer justify-start gap-4">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={Boolean(lang)}
                            onChange={() =>
                                handleChangeParam('lang', !Boolean(lang))
                            }
                        />
                        <span className="label-text ">
                            Перекладено українською
                        </span>
                    </label>
                </div>*/}
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-neutral">Статус</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {Object.keys(RELEASE_STATUS).map((slug) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'statuses',
                                        handleFilterSelect(slug, statuses),
                                    )
                                }
                                key={slug}
                                className={clsx(
                                    'btn-badge btn-secondary btn rounded-3xl px-3.5 py-1',
                                    statuses.includes(slug)
                                        ? 'btn-accent'
                                        : 'btn-outline',
                                )}
                            >
                                {RELEASE_STATUS[slug as Hikka.Status].title_ua}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-neutral">Тип</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {Object.keys(MEDIA_TYPE).map((slug) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'types',
                                        handleFilterSelect(slug, types),
                                    )
                                }
                                key={slug}
                                className={clsx(
                                    'btn-badge btn-secondary btn rounded-3xl px-3.5 py-1',
                                    types.includes(slug)
                                        ? 'btn-accent'
                                        : 'btn-outline',
                                )}
                            >
                                {MEDIA_TYPE[slug as Hikka.MediaType].title_ua}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-neutral">Сезон</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {Object.keys(SEASON).map((slug) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'seasons',
                                        handleFilterSelect(slug, seasons),
                                    )
                                }
                                key={slug}
                                className={clsx(
                                    'btn-badge btn-secondary btn rounded-3xl px-3.5 py-1',
                                    seasons.includes(slug)
                                        ? 'btn-accent'
                                        : 'btn-outline',
                                )}
                            >
                                {SEASON[slug as Hikka.Season].title_ua}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-neutral">Рейтинг</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(AGE_RATING).map((slug) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'ratings',
                                        handleFilterSelect(slug, ageRatings),
                                    )
                                }
                                key={slug}
                                className={clsx(
                                    'btn-badge btn-secondary btn rounded-3xl px-3.5 py-1',
                                    ageRatings.includes(slug)
                                        ? 'btn-accent'
                                        : 'btn-outline',
                                )}
                            >
                                {AGE_RATING[slug as Hikka.AgeRating].title_ua}
                                <div className="tooltip" data-tip={AGE_RATING[slug as Hikka.AgeRating].description}>
                                    <MaterialSymbolsInfoRounded className="transition duration-100 opacity-30 hover:opacity-100" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-neutral">
                            Рік виходу
                        </span>
                    </label>
                    <div className="flex gap-4 items-center">
                        <p className="badge">{selectingYears[0]}</p>
                        <Slider
                            onChangeCommitted={(_e, value) =>
                                handleChangeParam(
                                    'years',
                                    (value as number[]).map(String),
                                )
                            }
                            onChange={(_e, value) =>
                                setSelectingYears(
                                    (value as number[]).map(String),
                                )
                            }
                            min={YEARS[0]}
                            max={YEARS[1]}
                            marks={Array.from(
                                Array(
                                    Math.floor((YEARS[1] - YEARS[0]) / 5),
                                ).keys(),
                            ).map((_v, i) => ({
                                value: YEARS[0] + (i + 1) * 5,
                            }))}
                            value={selectingYears.map((y) => Number(y))}
                        />
                        <p className="badge">{selectingYears[1]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full flex gap-2 lg:relative sticky bottom-4">
                <button
                    onClick={clearFilters}
                    className="btn btn-outline flex-1 btn-error bg-black"
                >
                    <AntDesignClearOutlined />
                    Очистити
                </button>
                <label
                    htmlFor="filterDrawer"
                    className="btn btn-secondary drawer-button btn-square btn-outline flex lg:hidden bg-black"
                >
                    <AntDesignCloseOutlined />
                </label>
            </div>
        </div>
    );
};

export default Component;
