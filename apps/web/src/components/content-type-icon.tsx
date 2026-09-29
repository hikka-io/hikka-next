import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';

type Props = {
    contentType: ContentTypeEnum;
    className?: string;
};

const ContentTypeIcon: FC<Props> = ({ contentType, className }) => {
    const Icon = CONTENT_TYPE_ICONS[contentType];
    if (!Icon) return null;
    return <Icon className={className} />;
};

export default ContentTypeIcon;
