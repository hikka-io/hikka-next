import { type FC, useState } from 'react';

import { SegmentedControl } from '@expo/ui/community/segmented-control';
import { openBrowserAsync } from 'expo-web-browser';
import { View } from 'react-native';

import { ContentTypeEnum, ExternalTypeEnum } from '@hikka/api';
import { getPlatformIcon } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import Card from '@/components/ui/card';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';

import { SITE_ORIGIN } from './content-href';
import type { ContentInfo } from './queries';
import TextExpand from './text-expand';

const LINKS_MAX_HEIGHT = 160;

type Link = ContentInfo['external'][number];

const dedupeByUrl = (links: Link[]) =>
    Array.from(new Map(links.map((link) => [link.url, link])).values());

const linkImage = (link: Link) => {
    const icon = getPlatformIcon(link.url);

    return icon ? (
        `${SITE_ORIGIN}${icon}`
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

    const general = dedupeByUrl(
        content.external.filter(
            (link) => link.type === ExternalTypeEnum.GENERAL,
        ),
    );
    const watch = user
        ? dedupeByUrl(
              content.external.filter(
                  (link) =>
                      link.type === ExternalTypeEnum.WATCH ||
                      link.type === ExternalTypeEnum.READ,
              ),
          )
        : [];

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
                {tabs.length > 1 && (
                    <HeaderActions>
                        <SegmentedControl
                            values={tabs.map((tab) => tab.label)}
                            selectedIndex={index}
                            onChange={(event) =>
                                setActive(
                                    event.nativeEvent.selectedSegmentIndex,
                                )
                            }
                            style={{ width: 180 }}
                        />
                    </HeaderActions>
                )}
            </Header>
            <TextExpand
                key={index}
                maxHeight={LINKS_MAX_HEIGHT}
                surfaceClassName="bg-surface"
            >
                <View className="gap-4">
                    {tabs[index].links.map((link) => (
                        <HorizontalCard
                            key={link.url}
                            onPress={() => openBrowserAsync(link.url)}
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
