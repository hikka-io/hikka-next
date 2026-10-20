import type { FC } from 'react';

import { View } from 'react-native';

import type { TagResponse } from '@hikka/api';

import { Badge } from '@/components/ui/badge';

type Props = {
    tags: TagResponse[];
    // How many tags to show before a "+N" badge; every tag when unset.
    limit?: number;
};

const ArticleTags: FC<Props> = ({ tags, limit }) => {
    if (tags.length === 0) return null;

    const shown = limit === undefined ? tags : tags.slice(0, limit);
    const hidden = tags.length - shown.length;

    return (
        <View className="flex-row flex-wrap gap-2">
            {shown.map((tag) => (
                <Badge key={tag.name} variant="secondary">
                    {tag.name}
                </Badge>
            ))}
            {hidden > 0 && <Badge variant="outline">+{hidden}</Badge>}
        </View>
    );
};

export default ArticleTags;
