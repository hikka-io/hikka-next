'use client';

import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import MaterialSymbolsInfoIRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoIRounded';
import MaterialSymbolsPlayArrowRounded from '@/components/icons/material-symbols/MaterialSymbolsPlayArrowRounded';
import TextExpand from '@/components/text-expand';
import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import useMangaInfo from '@/services/hooks/manga/use-manga-info';
import { useModalContext } from '@/services/providers/modal-provider';

interface Props {
    extended?: boolean;
}

const Links: FC<Props> = ({ extended }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState<API.External['type']>('general');
    const params = useParams();
    const { openModal } = useModalContext();
    const { data: manga } = useMangaInfo({ slug: String(params.slug) });

    if (!manga) {
        return null;
    }

    if (manga.external.length === 0) {
        return null;
    }

    const readLinksData = manga.external.filter((l) => l.type === 'read');
    const generalLinksData = manga.external.filter((l) => l.type === 'general');

    const linksData = active === 'general' ? generalLinksData : readLinksData;

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
                    {readLinksData.length > 0 && (
                        <ToggleGroupItem
                            value="read"
                            aria-label="Посилання для читання"
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
                            </HorizontalCardContainer>
                        </HorizontalCard>
                    ))}
                </div>
            </TextExpand>
        </Block>
    );
};

export default Links;
