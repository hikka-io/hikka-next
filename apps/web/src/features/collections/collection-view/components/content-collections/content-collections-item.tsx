import { CollectionResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import { FC } from 'react';

import MaterialSymbolsDriveFileRenameOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsDriveFileRenameOutlineRounded';
import Small from '@/components/typography/small';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    collection: CollectionResponse<any>;
    className?: string;
}

const ContentCollectionsItem: FC<Props> = ({ collection, className }) => {
    return (
        <HorizontalCard
            className={className}
            href={`${CONTENT_TYPE_LINKS.collection}/${collection.reference}`}
            key={collection.reference}
        >
            <HorizontalCardImage
                href={`/u/${collection.author.username}`}
                image={collection.author.avatar}
                imageRatio={1}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{collection.title}</HorizontalCardTitle>
                <HorizontalCardDescription className="text-muted-foreground flex-row text-xs">
                    <div className="flex items-center gap-1">
                        <MaterialSymbolsDriveFileRenameOutlineRounded />
                        <Small>
                            {formatDistance(
                                collection.updated * 1000,
                                Date.now(),
                                {
                                    addSuffix: true,
                                },
                            )}
                        </Small>
                    </div>
                </HorizontalCardDescription>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default ContentCollectionsItem;