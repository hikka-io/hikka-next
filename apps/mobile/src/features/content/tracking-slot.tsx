import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

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

const TrackingSlot: FC<Props> = ({ contentType, slug, totals }) => (
    <ListStatusButton contentType={contentType} slug={slug} content={totals} />
);

export default TrackingSlot;
