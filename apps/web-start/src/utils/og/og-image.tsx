import {
    buildingIcon,
    coverPlaceholder,
    hikkaLogo,
    playIcon,
    starIcon,
    tvIcon,
} from './og-icons';
import type { OgContentCardData } from './og-utils';

const metaBadge = (icon: () => any, label: string) => (
    <div tw="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xl font-bold border border-neutral-800/60 bg-neutral-800/40 text-white shrink-0">
        {icon()}
        <span>{label}</span>
    </div>
);

export const renderOgCard = (data: OgContentCardData) => {
    const formattedScore = data.score > 0 ? data.score.toFixed(2) : null;

    return (
        <div
            tw="flex w-full h-full p-16 flex-col gap-12 items-end"
            style={{
                background: 'linear-gradient(315deg, #160820 0%, #000000 80%)',
            }}
        >
            <div tw="flex w-full items-start h-full gap-2 border border-neutral-800/60 rounded-2xl bg-black overflow-hidden">
                {data.image ? (
                    <img
                        src={data.image}
                        width={300}
                        height={420}
                        tw="object-cover shrink-0 h-full w-auto aspect-2/3"
                    />
                ) : (
                    coverPlaceholder()
                )}

                <div tw="flex flex-col flex-1 h-full justify-between min-w-0 p-8 gap-6">
                    <div tw="flex items-center gap-3">
                        <div tw="flex flex-wrap gap-3 items-center">
                            {metaBadge(playIcon, data.contentTypeLabel)}
                            {data.mediaType &&
                                metaBadge(tvIcon, data.mediaType)}

                            {data.producer &&
                                metaBadge(buildingIcon, data.producer)}
                        </div>
                    </div>
                    <div tw="flex flex-col justify-between flex-1 gap-8">
                        <div tw="flex flex-col gap-2">
                            <span tw="text-4xl font-bold leading-tight text-white line-clamp-3">
                                {data.title}
                                {data.year && (
                                    <span tw="font-normal">
                                        {' '}({data.year.toString()})
                                    </span>
                                )}
                            </span>

                            {data.subtitle && (
                                <span tw="text-2xl text-neutral-400 line-clamp-2">
                                    {data.subtitle}
                                </span>
                            )}
                        </div>
                        <div tw="flex items-end justify-between gap-4">
                            {data.genres.length > 0 && (
                                <div tw="flex flex-wrap gap-3 items-end">
                                    {data.genres.map((genre) => (
                                        <span
                                            key={genre}
                                            tw="px-3 py-1.5 rounded-xl text-xl font-bold bg-neutral-800 text-white"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {formattedScore && (
                                <div tw="flex items-center gap-2 border border-neutral-800/60 rounded-xl bg-neutral-800/40 px-3 py-1.5">
                                    <span tw="text-4xl font-bold text-white leading-none">
                                        {formattedScore}
                                    </span>
                                    {starIcon()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div tw="flex items-end justify-between">{hikkaLogo()}</div>
        </div>
    );
};
