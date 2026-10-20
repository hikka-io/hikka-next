import type { FC, ReactNode } from 'react';

import { View } from 'react-native';

import PosterCard from '@/components/content-card/poster-card';
import ExpandableMarkdown from '@/components/expandable-markdown';
import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type Props = {
    slug: string;
    title: string;
    original?: string | null;
    english?: string | null;
    synonyms: string[];
    image: string | ReactNode;
    description?: string | null;
};

const DetailRow: FC<{ label: string; value: string }> = ({ label, value }) => (
    <View className="gap-0.5">
        <Text className="text-muted-foreground text-xs">{label}</Text>
        <Text className="text-sm" selectable>
            {value}
        </Text>
    </View>
);

const EntityHeader: FC<Props> = ({
    slug,
    title,
    original,
    english,
    synonyms,
    image,
    description,
}) => {
    const rows = [
        english && english !== title
            ? { label: 'Імʼя англ.', value: english }
            : null,
        original ? { label: 'Імʼя оригіналу', value: original } : null,
        synonyms.length > 0
            ? { label: 'Синоніми', value: synonyms.join(', ') }
            : null,
    ].filter((row) => row !== null);
    const text = description?.trim();

    return (
        <View className="gap-6 px-4 pt-4">
            <View className="flex-row gap-4">
                <View className="w-32">
                    <PosterCard image={image} />
                </View>
                <View className="flex-1 justify-end gap-2">
                    <Text
                        accessibilityRole="header"
                        className="font-bold text-2xl leading-8"
                        selectable
                    >
                        {title}
                    </Text>
                    {original && original !== title && (
                        <Text
                            className="text-muted-foreground text-sm"
                            selectable
                        >
                            {original}
                        </Text>
                    )}
                </View>
            </View>
            {rows.length > 0 && (
                <Card variant="inset" className="gap-3 p-3">
                    {rows.map((row, index) => (
                        <View key={row.label} className="gap-3">
                            {index > 0 && <Separator />}
                            <DetailRow {...row} />
                        </View>
                    ))}
                </Card>
            )}
            {text ? (
                <View className="gap-3">
                    <Header>
                        <HeaderTitle>Опис</HeaderTitle>
                    </Header>
                    <ExpandableMarkdown contentKey={slug} selectable>
                        {text}
                    </ExpandableMarkdown>
                </View>
            ) : null}
        </View>
    );
};

export default EntityHeader;
