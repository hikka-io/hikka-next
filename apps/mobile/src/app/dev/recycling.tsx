import { FlashList } from '@shopify/flash-list';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

import PosterCard from '@/components/content-card/poster-card';
import { MDViewer } from '@/components/markdown';
import TextExpand from '@/components/text-expand';
import { Text } from '@/components/ui/text';

const POSTER =
    'https://cdn.hikka.io/content/anime/sousou-no-frieren-ad4e3e/8D-SGEkCBMAUE7CgEt9UPQ.jpg';

// Every other item has the same long text, so recycled cells often get content of the same height.
const ITEMS = Array.from({ length: 300 }, (_, index) => ({
    id: String(index + 1),
    text:
        index % 2 === 0
            ? Array.from(
                  { length: 6 },
                  (_, line) =>
                      `Рядок ${line + 1}: :spoiler[спойлер] і текст, що займає місце.`,
              ).join('\n\n')
            : 'Короткий текст.',
}));

// Reveal a poster, open a spoiler and expand a text in a few cells, scroll far and back:
// only those cells may stay open; a recycled cell must always arrive hidden and collapsed.
export default function RecyclingCheckScreen() {
    if (!__DEV__) return <Redirect href="/" />;

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            data={ITEMS}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <Text className="px-4 pt-4 text-muted-foreground text-sm">
                    Відкрийте кілька комірок і прокрутіть далеко вниз: нові
                    комірки мають бути прихованими та згорнутими.
                </Text>
            }
            renderItem={({ item }) => (
                <View className="flex-row gap-4 px-4 py-3">
                    <PosterCard
                        className="w-20"
                        title={`Тайтл ${item.id}`}
                        image={POSTER}
                        imageBlur
                        titleBlur
                        onPress={() => {}}
                    />
                    <View className="flex-1 gap-1">
                        <Text className="font-medium text-sm">
                            {`Комірка ${item.id}`}
                        </Text>
                        <TextExpand lines={3} contentKey={item.id}>
                            <MDViewer key={item.id}>{item.text}</MDViewer>
                        </TextExpand>
                    </View>
                </View>
            )}
        />
    );
}
