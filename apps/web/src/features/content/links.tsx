import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type ExternalResponse,
    ExternalTypeEnum,
    type MainContentTypeEnum,
} from '@hikka/api';
import { getPlatformIcon, groupExternalLinks } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import MaterialSymbolsInfoIRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoIRounded';
import MaterialSymbolsPlayArrowRounded from '@/components/icons/material-symbols/MaterialSymbolsPlayArrowRounded';
import ShowMoreTrigger from '@/components/show-more-trigger';
import Block from '@/components/ui/block';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

const PREVIEW_ROWS = 3;

const LinkRow: FC<{ link: ExternalResponse }> = ({ link }) => {
    const icon = getPlatformIcon(link.url);

    return (
        <HorizontalCard>
            <HorizontalCardImage
                imageRatio={1}
                className="w-10"
                image={
                    icon ? (
                        <img
                            src={icon}
                            alt={link.text}
                            className="size-full object-contain"
                        />
                    ) : (
                        <p>{link.text[0]}</p>
                    )
                }
                to={link.url}
                referrerPolicy="origin"
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle
                    href={link.url}
                    target="_blank"
                    referrerPolicy="origin"
                >
                    {link.text}
                </HorizontalCardTitle>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentLinks: FC<Props> = ({ content_type }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState<ExternalTypeEnum>(
        ExternalTypeEnum.GENERAL,
    );
    const { user } = useSession();
    const params = useParams();
    const { data: content } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    if (!content) {
        return null;
    }

    if (content.external.length === 0) {
        return null;
    }

    const { general: generalLinksData, watch: watchLinksData } =
        groupExternalLinks(content.external, { withWatch: !!user });

    const hasWatchLinks = watchLinksData.length > 0;
    const linksData =
        active === ExternalTypeEnum.WATCH && hasWatchLinks
            ? watchLinksData
            : generalLinksData;

    const preview = linksData.slice(0, PREVIEW_ROWS);
    const rest = linksData.slice(PREVIEW_ROWS);

    const handleChangeActive = (value: string) => {
        setActive(value as ExternalTypeEnum);
        setIsExpanded(false);
    };

    return (
        <Block variant="card" id="content-links">
            <Header>
                <HeaderTitle>Посилання</HeaderTitle>
                {hasWatchLinks && (
                    <Tabs value={active} onValueChange={handleChangeActive}>
                        <TabsList size="sm">
                            <TabsTrigger
                                value={ExternalTypeEnum.GENERAL}
                                aria-label="Загальні посилання"
                            >
                                <MaterialSymbolsInfoIRounded />
                            </TabsTrigger>
                            <TabsTrigger
                                value={ExternalTypeEnum.WATCH}
                                aria-label="Посилання для перегляду"
                            >
                                <MaterialSymbolsPlayArrowRounded />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}
            </Header>
            <Collapsible
                open={isExpanded}
                onOpenChange={setIsExpanded}
                className="flex flex-col gap-4"
            >
                {preview.map((link) => (
                    <LinkRow key={link.url} link={link} />
                ))}
                {rest.length > 0 && (
                    <>
                        <CollapsibleContent className="flex flex-col gap-4">
                            {rest.map((link) => (
                                <LinkRow key={link.url} link={link} />
                            ))}
                        </CollapsibleContent>
                        <ShowMoreTrigger count={rest.length} />
                    </>
                )}
            </Collapsible>
        </Block>
    );
};

export default ContentLinks;
