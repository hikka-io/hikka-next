'use client';

import AnimeCard from '@/components/anime-card';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    data: Hikka.Watch[];
}

const Component = ({ data }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {data.map((res) => (
                <AnimeCard
                    slug={res.anime.slug}
                    key={res.reference}
                    title={
                        res.anime[titleLanguage!] ||
                        res.anime.title_ua ||
                        res.anime.title_en ||
                        res.anime.title_ja
                    }
                    poster={res.anime.poster}
                    href={`/anime/${res.anime.slug}`}
                />
            ))}
        </div>
    );
};

export default Component;
