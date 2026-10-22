import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type ExternalResponse,
    ExternalTypeEnum,
    type MainContentTypeEnum,
} from '@hikka/api';
import {
    detectLinkIcon,
    getPlatformIcon,
    groupExternalLinks,
} from '@hikka/core';

import MaterialSymbolsInfoIRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoIRounded';
import MaterialSymbolsOpenInNewRounded from '@/components/icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import MaterialSymbolsPlayArrowRounded from '@/components/icons/material-symbols/MaterialSymbolsPlayArrowRounded';
import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import LinkSummary from '@/components/link-summary';
import ShowMoreTrigger from '@/components/show-more-trigger';
import Block from '@/components/ui/block';
import { buttonVariants } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

const PREVIEW_ROWS = 3;

type LinkRowProps = {
    link: ExternalResponse;
};

const linkIcon = (url: string) => {
    const platformIcon = getPlatformIcon(url);
    if (platformIcon) return <img src={platformIcon} alt="" />;

    const Icon = USER_LINK_ICONS[detectLinkIcon(url)];
    return <Icon />;
};

const LinkRow: FC<LinkRowProps> = ({ link }) => {
    return (
        <a
            href={link.url}
            target="_blank"
            referrerPolicy="origin"
            className={cn(
                buttonVariants({ variant: 'ghost' }),
                'group -mx-2 h-auto justify-start gap-3 p-2 text-left',
            )}
            rel="noopener"
        >
            <LinkSummary
                icon={linkIcon(link.url)}
                label={link.text}
                url={link.url}
            />
            <MaterialSymbolsOpenInNewRounded className="text-muted-foreground opacity-0 group-hover:opacity-100" />
        </a>
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

    const { general: generalLinksData, watch: watchLinksData } =
        groupExternalLinks(content.external, { withWatch: !!user });

    if (generalLinksData.length === 0 && watchLinksData.length === 0) {
        return null;
    }

    const hasTabs = generalLinksData.length > 0 && watchLinksData.length > 0;
    const showWatch =
        watchLinksData.length > 0 &&
        (active === ExternalTypeEnum.WATCH || generalLinksData.length === 0);
    const linksData = showWatch ? watchLinksData : generalLinksData;

    const preview = linksData.slice(0, PREVIEW_ROWS);
    const rest = linksData.slice(PREVIEW_ROWS);

    const watchLabel =
        content_type === ContentTypeEnum.ANIME ? 'Перегляд' : 'Читання';

    const handleChangeActive = (value: string) => {
        setActive(value as ExternalTypeEnum);
        setIsExpanded(false);
    };

    return (
        <Block variant="card" id="content-links">
            <Header>
                <HeaderTitle>Посилання</HeaderTitle>
                {hasTabs && (
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
                                aria-label={watchLabel}
                            >
                                <MaterialSymbolsPlayArrowRounded />
                                <span className="lg:max-xl:hidden">
                                    {watchLabel}
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}
            </Header>
            <Collapsible
                open={isExpanded}
                onOpenChange={setIsExpanded}
                className="flex flex-col gap-1"
            >
                {preview.map((link) => (
                    <LinkRow key={link.url} link={link} />
                ))}
                {rest.length > 0 && (
                    <>
                        <CollapsibleContent className="flex flex-col gap-1">
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
