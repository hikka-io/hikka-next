'use client';

import { useParams } from 'next/navigation';

import P from '@/components/typography/p';
import { Badge } from '@/components/ui/badge';
import HorizontalCard from '@/components/ui/horizontal-card';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import { cn } from '@/utils/utils';

const LinksModal = () => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    if (!anime) {
        return null;
    }

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {anime.external &&
                anime.external.map((link) => (
                    <HorizontalCard
                        className="px-6 py-4"
                        key={link.url}
                        title={link.text}
                        description={link.url}
                        descriptionHref={link.url}
                        href={link.url}
                        imageRatio={1}
                        imageContainerClassName="w-10"
                        descriptionClassName="break-all"
                        image={<P>{link.text[0]}</P>}
                    >
                        <Badge
                            className={cn(
                                'bg-warning text-warning-foreground',
                                link.type === 'general' &&
                                    'bg-success text-success-foreground',
                            )}
                            variant="status"
                        >
                            {link.type === 'general' ? 'Загальне' : 'Перегляд'}
                        </Badge>
                    </HorizontalCard>
                ))}
        </div>
    );
};

export default LinksModal;
