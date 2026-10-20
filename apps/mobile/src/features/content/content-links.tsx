import { type FC, useState } from 'react';

import { SegmentedControl } from '@expo/ui/community/segmented-control';
import { openBrowserAsync } from 'expo-web-browser';
import { View } from 'react-native';
import { toast } from 'sonner-native';

import { ContentTypeEnum } from '@hikka/api';
import { getPlatformIcon, groupExternalLinks, parseUrl } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import TextExpand from '@/components/text-expand';
import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { siteUrl } from '@/utils/site-origin';

import type { ContentInfo } from './queries';

const LINKS_MAX_HEIGHT = 160;

type Link = ContentInfo['external'][number];

const WEB_PROTOCOLS = ['http:', 'https:'];

const openLink = (url: string) => {
    if (!WEB_PROTOCOLS.includes(parseUrl(url)?.protocol ?? '')) return;
    openBrowserAsync(url).catch(() =>
        toast.error('Не вдалося відкрити посилання'),
    );
};

const linkImage = (link: Link) => {
    const icon = getPlatformIcon(link.url);

    return icon ? (
        siteUrl(icon)
    ) : (
        <Text className="font-medium text-muted-foreground">
            {link.text[0]}
        </Text>
    );
};

type Props = {
    content: ContentInfo;
};

const ContentLinks: FC<Props> = ({ content }) => {
    const { user } = useSession();
    const [active, setActive] = useState(0);

    const { general, watch } = groupExternalLinks(content.external, {
        withWatch: !!user,
    });

    if (general.length === 0 && watch.length === 0) {
        return null;
    }

    const tabs = [
        { label: 'Загальні', links: general },
        {
            label:
                content.data_type === ContentTypeEnum.ANIME
                    ? 'Перегляд'
                    : 'Читання',
            links: watch,
        },
    ].filter((tab) => tab.links.length > 0);
    const index = active < tabs.length ? active : 0;

    return (
        <Card>
            <Header>
                <HeaderTitle>Посилання</HeaderTitle>
            </Header>
            {tabs.length > 1 && (
                <SegmentedControl
                    values={tabs.map((tab) => tab.label)}
                    selectedIndex={index}
                    onChange={(event) =>
                        setActive(event.nativeEvent.selectedSegmentIndex)
                    }
                />
            )}
            <TextExpand
                key={index}
                maxHeight={LINKS_MAX_HEIGHT}
                surfaceClassName="bg-surface"
                expandLabel="Показати всі посилання"
            >
                <View className="gap-4">
                    {tabs[index].links.map((link) => (
                        <HorizontalCard
                            key={link.url}
                            onPress={() => openLink(link.url)}
                        >
                            <HorizontalCardImage
                                imageRatio={1}
                                className="w-10"
                                image={linkImage(link)}
                            />
                            <HorizontalCardContainer>
                                <HorizontalCardTitle>
                                    {link.text}
                                </HorizontalCardTitle>
                            </HorizontalCardContainer>
                        </HorizontalCard>
                    ))}
                </View>
            </TextExpand>
        </Card>
    );
};

export default ContentLinks;
