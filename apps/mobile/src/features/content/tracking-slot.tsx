import type { FC } from 'react';

import { View } from 'react-native';

import type { MainContentTypeEnum } from '@hikka/api';

import { FavouriteButton } from '@/components/favourite';
import { ListStatusButton } from '@/components/tracking';

export type ProgressTotals = {
    episodes_total?: number | null;
    chapters?: number | null;
    volumes?: number | null;
};

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
    totals: ProgressTotals;
};

/** The web's `ContentActions`: the list button beside the favourite heart. */
const TrackingSlot: FC<Props> = ({ contentType, slug, totals }) => (
    <View className="flex-row gap-4">
        <ListStatusButton
            contentType={contentType}
            slug={slug}
            content={totals}
            className="flex-1"
        />
        <FavouriteButton contentType={contentType} slug={slug} />
    </View>
);

export default TrackingSlot;
