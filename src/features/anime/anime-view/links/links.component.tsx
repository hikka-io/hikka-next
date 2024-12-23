'use client';

import { useParams } from 'next/navigation';
import { FC, useState } from 'react';
import MaterialSymbolsInfoIRounded from '~icons/material-symbols/info-i-rounded';
import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';

import TextExpand from '@/components/text-expand';
import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import { useModalContext } from '@/services/providers/modal-provider';

interface Props {
    extended?: boolean;
}

const Links: FC<Props> = ({ extended }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState<API.External['type']>('general');
    const params = useParams();
    const { openModal } = useModalContext();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    if (!anime) {
        return null;
    }

    if (anime.external.length === 0) {
        return null;
    }

    const watchLinksData = anime.external.filter((l) => l.type === 'watch');
    const generalLinksData = anime.external.filter((l) => l.type === 'general');

    const linksData = active === 'general' ? generalLinksData : watchLinksData;

    const handleChangeActive = (value: API.External['type']) => {
        if (value) {
            setActive(value);
            setIsExpanded(false);
        }
    };

    return (
        <Block>
            <Header title="Посилання">
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={handleChangeActive}
                    size="badge"
                >
                    <ToggleGroupItem
                        value="general"
                        aria-label="Загальні посилання"
                    >
                        <MaterialSymbolsInfoIRounded />
                    </ToggleGroupItem>
                    {watchLinksData.length > 0 && (
                        <ToggleGroupItem
                            value="watch"
                            aria-label="Посилання для перегляду"
                        >
                            <MaterialSymbolsPlayArrowRounded />
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </Header>
            <TextExpand
                expanded={isExpanded}
                setExpanded={setIsExpanded}
                className="max-h-40"
            >
                <div className="flex flex-col gap-4">
                    {linksData.map((link) => (
                        <HorizontalCard key={link.url} href={link.url}>
                            <HorizontalCardImage
                                imageRatio={1}
                                className="w-8"
                                image={<P>{link.text[0]}</P>}
                            />
                            <HorizontalCardContainer>
                                <HorizontalCardTitle>
                                    {link.text}
                                </HorizontalCardTitle>
                                <HorizontalCardDescription></HorizontalCardDescription>
                            </HorizontalCardContainer>
                        </HorizontalCard>
                    ))}
                </div>
            </TextExpand>
        </Block>
    );
};

export default Links;
