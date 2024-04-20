'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import H4 from '@/components/typography/h4';
import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';

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
        <Block>
            <Header
                title="Посилання"
                href={!extended ? params.slug + '/links' : undefined}
            >
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: API.External['type']) =>
                        value && setActive(value)
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
            </Header>
            <Stack
                extended={extended}
                extendedSize={3}
                size={3}
                className="grid-min-14"
            >
                {active === 'general' &&
                    filteredGeneralLinksData.map((link) => (
                        <ExternalLink link={link} key={link.url} />
                    ))}
                {active === 'watch' &&
                    filteredWatchLinksData.map((link) => (
                        <ExternalLink link={link} key={link.url} />
                    ))}
            </Stack>
        </Block>
    );
};

export default Links;
