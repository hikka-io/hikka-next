'use client';

import { ContentTypeEnum, ExternalTypeEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';

import MaterialSymbolsInfoIRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoIRounded';
import MaterialSymbolsPlayArrowRounded from '@/components/icons/material-symbols/MaterialSymbolsPlayArrowRounded';
import TextExpand from '@/components/text-expand';
import P from '@/components/typography/p';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { CONTENT_CONFIG } from '@/utils/constants/common';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Links: FC<Props> = ({ content_type }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState<ExternalTypeEnum>(
        ExternalTypeEnum.GENERAL,
    );
    const params = useParams();
    const { data: content } = CONTENT_CONFIG[content_type].useInfo(
        String(params.slug),
    );

    if (!content) {
        return null;
    }

    if (content.external.length === 0) {
        return null;
    }

    const watchLinksData = content.external.filter(
        (l) => l.type === ExternalTypeEnum.WATCH,
    );
    const generalLinksData = content.external.filter(
        (l) => l.type === ExternalTypeEnum.GENERAL,
    );

    const linksData =
        active === ExternalTypeEnum.GENERAL ? generalLinksData : watchLinksData;

    const handleChangeActive = (value: ExternalTypeEnum) => {
        if (value) {
            setActive(value);
            setIsExpanded(false);
        }
    };

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Посилання</HeaderTitle>
                    <ToggleGroup
                        type="single"
                        value={active}
                        onValueChange={handleChangeActive}
                        size="badge"
                    >
                        <ToggleGroupItem
                            value={ExternalTypeEnum.GENERAL}
                            aria-label="Загальні посилання"
                        >
                            <MaterialSymbolsInfoIRounded />
                        </ToggleGroupItem>
                        {watchLinksData.length > 0 && (
                            <ToggleGroupItem
                                value={ExternalTypeEnum.WATCH}
                                aria-label="Посилання для перегляду"
                            >
                                <MaterialSymbolsPlayArrowRounded />
                            </ToggleGroupItem>
                        )}
                    </ToggleGroup>
                </HeaderContainer>
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
