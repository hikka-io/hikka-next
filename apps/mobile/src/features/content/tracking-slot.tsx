import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

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

const TrackingSlot: FC<Props> = () => null;

export default TrackingSlot;
