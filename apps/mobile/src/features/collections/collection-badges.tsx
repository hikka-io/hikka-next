import type { FC } from 'react';

import { View } from 'react-native';

import type { CollectionResponse } from '@hikka/api';

import { Badge } from '@/components/ui/badge';

type Props = {
    collection: Pick<CollectionResponse, 'spoiler' | 'nsfw' | 'tags'>;
    // How many tags to show before a "+N" badge; every tag when unset.
    limit?: number;
};

const CollectionBadges: FC<Props> = ({ collection, limit }) => {
    const { spoiler, nsfw, tags } = collection;
    const shown = limit === undefined ? tags : tags.slice(0, limit);
    const hidden = tags.length - shown.length;

    if (!spoiler && !nsfw && tags.length === 0) return null;

    return (
        <View className="flex-row flex-wrap gap-2">
            {spoiler && <Badge variant="warning">Спойлери</Badge>}
            {nsfw && <Badge variant="destructive">+18</Badge>}
            {shown.map((tag) => (
                <Badge key={tag} variant="secondary">
                    {tag.toLowerCase()}
                </Badge>
            ))}
            {hidden > 0 && <Badge variant="outline">+{hidden}</Badge>}
        </View>
    );
};

export default CollectionBadges;
