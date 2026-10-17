import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import type { CardEntity } from '@/components/content-card/entity';
import EntityCard from '@/components/content-card/entity-card';

import type { FranchiseContent } from '../franchise-model';

type Props = {
    content: FranchiseContent;
    /** Off where a list button beside the poster already shows the status. */
    withStatus?: boolean;
    className?: string;
};

function cardEntity(
    content: FranchiseContent,
    withStatus: boolean,
): CardEntity {
    switch (content.data_type) {
        case ContentTypeEnum.ANIME:
            return {
                type: content.data_type,
                data: content,
                watch: withStatus ? (content.watch[0] ?? null) : null,
            };
        case ContentTypeEnum.MANGA:
            return {
                type: content.data_type,
                data: content,
                read: withStatus ? (content.read[0] ?? null) : null,
            };
        default:
            return {
                type: content.data_type,
                data: content,
                read: withStatus ? (content.read[0] ?? null) : null,
            };
    }
}

const FranchisePoster: FC<Props> = ({
    content,
    withStatus = false,
    className,
}) => (
    <EntityCard
        entity={cardEntity(content, withStatus)}
        statusSize="sm"
        title={null}
        imagePreset="cardXs"
        containerClassName="rounded-(--base-radius)"
        imageClassName="size-full! object-cover"
        imageProps={{ resize: 'fill' }}
        className={className}
    />
);

export default FranchisePoster;
