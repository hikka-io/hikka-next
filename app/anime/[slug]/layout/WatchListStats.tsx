'use client'

import { WATCH_STATUS } from '@/utils/constants';
import { NumericFormat } from 'react-number-format';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

const Component = () => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    const sumStats =
        data.stats.completed +
        data.stats.on_hold +
        data.stats.dropped +
        data.stats.planned +
        data.stats.watching;

    return (
        <div className="flex flex-col gap-8">
            <h3>У Списках</h3>
            <div className="flex flex-col gap-4">
                {Object.keys(data.stats)
                    .filter((stat) => !stat.includes('score'))
                    .map((stat) => {
                        const status = WATCH_STATUS[stat as Hikka.WatchStatus];

                        return (
                            <div key={stat} className="flex items-center gap-2">
                                <div className="w-16">
                                    <p className="text-xs">
                                        <NumericFormat
                                            value={
                                                data.stats[
                                                    stat as Hikka.WatchStatus
                                                ]
                                            }
                                            displayType="text"
                                            thousandSeparator
                                        />
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <div
                                        className="bg-primary rounded-sm h-3"
                                        style={{
                                            width: `${
                                                (100 *
                                                    data.stats[
                                                        stat as Hikka.WatchStatus
                                                    ]) /
                                                sumStats
                                            }%`,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-right">
                                    {status.title_ua || status.title_en}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Component;