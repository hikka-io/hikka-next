import { type FC, useEffect } from 'react';

import type { LucideIcon } from 'lucide-react-native';
import {
    FileText,
    Layers,
    LayoutGrid,
    MessageCircle,
    Star,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { FeedContentTypeEnum } from '@hikka/api';

import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';

import ToggleChip from '../toggle-chip';

type QuickFilter = {
    label: string;
    value: FeedContentTypeEnum | null;
    icon: LucideIcon;
};

const QUICK_FILTERS: QuickFilter[] = [
    { label: 'Усе', value: null, icon: LayoutGrid },
    { label: 'Відгуки', value: FeedContentTypeEnum.REVIEW, icon: Star },
    {
        label: 'Коментарі',
        value: FeedContentTypeEnum.COMMENT,
        icon: MessageCircle,
    },
    { label: 'Колекції', value: FeedContentTypeEnum.COLLECTION, icon: Layers },
    { label: 'Статті', value: FeedContentTypeEnum.ARTICLE, icon: FileText },
];

type Props = {
    activeType: FeedContentTypeEnum | null | undefined;
    onTypeChange: (value: FeedContentTypeEnum | null) => void;
    onlyFollowed?: boolean;
    onOnlyFollowedChange?: (value: boolean) => void;
    onMount: () => void;
};

const FeedHeader: FC<Props> = ({
    activeType,
    onTypeChange,
    onlyFollowed,
    onOnlyFollowedChange,
    onMount,
}) => {
    useEffect(onMount, [onMount]);

    return (
        <View className="gap-3">
            <Header>
                <HeaderTitle>Стрічка</HeaderTitle>
                {onOnlyFollowedChange && (
                    <HeaderActions>
                        <ToggleChip
                            selected={onlyFollowed}
                            onPress={() => onOnlyFollowedChange(!onlyFollowed)}
                        >
                            Власна
                        </ToggleChip>
                    </HeaderActions>
                )}
            </Header>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 px-4"
                className="-mx-4"
            >
                {QUICK_FILTERS.map((filter) => (
                    <ToggleChip
                        key={filter.label}
                        selected={filter.value === activeType}
                        onPress={() => onTypeChange(filter.value)}
                    >
                        <Icon as={filter.icon} />
                        {filter.label}
                    </ToggleChip>
                ))}
            </ScrollView>
        </View>
    );
};

export default FeedHeader;
