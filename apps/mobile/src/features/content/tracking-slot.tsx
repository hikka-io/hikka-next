import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
};

// Tracking slot: the watch/read list button from `components/tracking` renders here (wired in at merge).
const TrackingSlot: FC<Props> = () => null;

export default TrackingSlot;
