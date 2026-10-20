import { type FC, useState } from 'react';

import { View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import { getPlatformIcon, groupExternalLinks } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import TextExpand from '@/components/text-expand';
import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import SegmentedControl from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { siteUrl } from '@/utils/site-origin';

import { openWebLink } from './open-web-link';
import type { ContentInfo } from './queries';

const LINKS_MAX_HEIGHT = 160;

type Link = ContentInfo['external'][number];

type LinkTab = 'general' | 'watch';

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
    const [active, setActive] = useState<LinkTab>('general');

    const { general, watch } = groupExternalLinks(content.external, {
        withWatch: !!user,
    });

    if (general.length === 0 && watch.length === 0) {
        return null;
    }

    const tabs = [
        { value: 'general' as const, label: 'Загальні', links: general },
        {
            value: 'watch' as const,
            label:
                content.data_type === ContentTypeEnum.ANIME
                    ? 'Перегляд'
                    : 'Читання',
            links: watch,
        },
    ].filter((tab) => tab.links.length > 0);
    const tab = tabs.find((option) => option.value === active) ?? tabs[0];

    return (
        <Card>
            <Header>
                <HeaderTitle>Посилання</HeaderTitle>
            </Header>
            {tabs.length > 1 && (
                <SegmentedControl
                    options={tabs}
                    value={tab.value}
                    onValueChange={setActive}
                />
            )}
            <TextExpand
                key={tab.value}
                maxHeight={LINKS_MAX_HEIGHT}
                surfaceClassName="bg-surface"
                expandLabel="Показати всі посилання"
            >
                <View className="gap-4">
                    {tab.links.map((link) => (
                        <HorizontalCard
                            key={link.url}
                            onPress={() => openWebLink(link.url)}
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
