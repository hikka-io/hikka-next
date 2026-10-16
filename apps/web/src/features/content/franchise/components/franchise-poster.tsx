import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import type { CardEntity } from '@/components/content-card/entity';
import EntityCard from '@/components/content-card/entity-card';

import type { FranchiseContent } from '../franchise-model';

type Props = {
    content: FranchiseContent;
    className?: string;
};

// The row's list button already shows the status, so the poster drops its chip.
function untrackedEntity(content: FranchiseContent): CardEntity {
    switch (content.data_type) {
        case ContentTypeEnum.ANIME:
            return { type: content.data_type, data: content, watch: null };
        case ContentTypeEnum.MANGA:
            return { type: content.data_type, data: content, read: null };
        default:
            return { type: content.data_type, data: content, read: null };
    }
}

const FranchisePoster: FC<Props> = ({ content, className }) => (
    <EntityCard
        entity={untrackedEntity(content)}
        title={null}
        imagePreset="cardXs"
        className={className}
    />
);

export default FranchisePoster;
