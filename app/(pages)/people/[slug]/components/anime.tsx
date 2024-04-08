'use client';

import { useParams } from 'next/navigation';



import EntryCard from '@/components/entry-card/entry-card';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import usePersonAnime from '@/services/hooks/people/usePersonAnime';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { cn } from '@/utils/utils';


interface Props {
    extended?: boolean;
}

const Anime = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonAnime({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={'Аніме'}
                href={!extended ? params.slug + '/anime' : undefined}
            />
            <div
                className={cn(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                    !extended && 'grid-min-10 no-scrollbar -mx-4 grid-flow-col grid-cols-scroll auto-cols-scroll overflow-x-auto px-4'
                )}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <EntryCard
                        slug={ch.anime.slug}
                        key={ch.anime.slug}
                        href={`/anime/${ch.anime.slug}`}
                        poster={ch.anime.poster}
                        withContextMenu
                        content_type="anime"
                        title={
                            ch.anime[titleLanguage!] ||
                            ch.anime.title_ua ||
                            ch.anime.title_ua ||
                            ch.anime.title_ja
                        }
                        description={
                            ch.roles[0]?.name_ua || ch.roles[0]?.name_en
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
            {extended && hasNextPage && (
                <Button
                    variant="outline"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
            )}
        </div>
    );
};

export default Anime;
