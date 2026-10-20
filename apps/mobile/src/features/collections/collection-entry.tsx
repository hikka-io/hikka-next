import type { FC } from 'react';

import { Info } from 'lucide-react-native';
import { Alert, Pressable, View } from 'react-native';

import type { CollectionContentResponse, ContentTypeEnum } from '@hikka/api';
import { getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { Icon } from '@/components/ui/icon';
import { contentHref } from '@/utils/content-href';

type Props = {
    item: CollectionContentResponse;
};

/** One collection entry; the author's note opens from an info button over the poster, like the web's popover. */
const CollectionEntry: FC<Props> = ({ item }) => {
    const title = getTitle(item.content);
    const { comment } = item;

    return (
        <PosterCard
            href={contentHref(
                item.content.data_type as ContentTypeEnum,
                item.content.slug,
            )}
            title={title}
            image={item.content.image ?? undefined}
            overlay={
                comment ? (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Коментар автора"
                        onPress={() => Alert.alert(title, comment)}
                        className="absolute right-0 bottom-0 size-11 items-center justify-center active:opacity-70"
                    >
                        <View className="size-7 items-center justify-center rounded-md bg-secondary/80">
                            <Icon as={Info} className="size-4" />
                        </View>
                    </Pressable>
                ) : undefined
            }
        />
    );
};

export default CollectionEntry;
