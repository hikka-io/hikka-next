'use client';

import EntryCard from '@/components/entry-card/entry-card';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    data: API.Watch[];
}

const Component = ({ data }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
            {data.map((res) => (
                <EntryCard
                    slug={res.anime.slug}
                    content_type="anime"
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
