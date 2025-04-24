'use client';

import { ExternalTypeEnum } from '@hikka/client';
import { useNovelInfo } from '@hikka/react';
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
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
    extended?: boolean;
}

const Links: FC<Props> = ({ extended }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState<ExternalTypeEnum>(
        ExternalTypeEnum.GENERAL,
    );
    const params = useParams();
    const { data: novel } = useNovelInfo({ slug: String(params.slug) });

    if (!novel) {
        return null;
    }

    if (novel.external.length === 0) {
        return null;
    }

    const readLinksData = novel.external.filter(
        (l) => l.type === ExternalTypeEnum.READ,
    );
    const generalLinksData = novel.external.filter(
        (l) => l.type === ExternalTypeEnum.GENERAL,
    );

    const linksData =
        active === ExternalTypeEnum.GENERAL ? generalLinksData : readLinksData;

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
                        {readLinksData.length > 0 && (
                            <ToggleGroupItem
                                value={ExternalTypeEnum.READ}
                                aria-label="Посилання для читання"
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
                            </HorizontalCardContainer>
                        </HorizontalCard>
                    ))}
                </div>
            </TextExpand>
        </Block>
    );
};

export default Links;
