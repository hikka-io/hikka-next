'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import H4 from '@/components/typography/h4';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import { cn } from '@/utils';

interface Props {
    extended?: boolean;
}

const ExternalLink = ({ link }: { link: API.External }) => {
    return (
        <Button variant="outline" className="p-6" asChild>
            <Link
                href={link.url}
                target="_blank"
                className="flex h-auto flex-col items-center justify-center gap-2 overflow-hidden rounded-lg text-center"
            >
                <H4 className="w-full truncate">{link.text}</H4>
                <P className="w-full truncate text-xs lowercase">{link.url}</P>
            </Link>
        </Button>
    );
};

const Links = ({ extended }: Props) => {
    const [active, setActive] = useState<API.External['type']>('general');
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    if (!anime) {
        return null;
    }

    const watchLinksData = anime.external.filter((l) => l.type === 'watch');
    const generalLinksData = anime.external.filter((l) => l.type === 'general');

    const filteredWatchLinksData = extended
        ? watchLinksData
        : watchLinksData.slice(0, 3);
    const filteredGeneralLinksData = extended
        ? generalLinksData
        : generalLinksData.slice(0, 3);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Посилання"
                href={!extended ? params.slug + '/links' : undefined}
            >
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: API.External['type']) =>
                        setActive(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    <ToggleGroupItem
                        value="general"
                        aria-label="Загальні посилання"
                    >
                        Загальне
                    </ToggleGroupItem>
                    {watchLinksData.length > 0 && (
                        <ToggleGroupItem
                            value="watch"
                            aria-label="Посилання для перегляду"
                        >
                            Перегляд
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </SubHeader>
            <div
                className={cn(
                    'grid gap-4 md:grid-cols-3 lg:gap-8',
                    !extended &&
                        'no-scrollbar grid-min-14 -mx-4 grid-flow-col grid-cols-scroll-3 overflow-x-auto px-4',
                )}
            >
                {active === 'general' &&
                    filteredGeneralLinksData.map((link) => (
                        <ExternalLink link={link} key={link.url} />
                    ))}
                {active === 'watch' &&
                    filteredWatchLinksData.map((link) => (
                        <ExternalLink link={link} key={link.url} />
                    ))}
            </div>
        </div>
    );
};

export default Links;
