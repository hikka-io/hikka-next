import { FC, PropsWithChildren } from 'react';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsCategoryOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsCategoryOutlineRounded';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props extends PropsWithChildren {
    content: API.MainContent;
    content_type: API.ContentType;
    slug: string;
}

const General: FC<Props> = ({ content, content_type, slug }) => {
    const image = content.data_type === 'anime' ? content.image : content.image;
    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Card className="w-full">
            <HorizontalCard href={link || '#'}>
                <HorizontalCardImage image={image} className="w-14" />
                <HorizontalCardContainer>
                    <HorizontalCardTitle>Інформація</HorizontalCardTitle>
                    <HorizontalCardDescription>
                        <MaterialSymbolsCategoryOutlineRounded className="size-4 text-muted-foreground" />
                        {CONTENT_TYPES[content_type].title_ua}
                    </HorizontalCardDescription>
                    {(content.data_type === 'anime' ||
                        content.data_type === 'manga' ||
                        content.data_type === 'novel') && (
                        <HorizontalCardDescription>
                            <MaterialSymbolsCalendarClockRounded className="size-4 text-muted-foreground" />
                            {content.year}
                        </HorizontalCardDescription>
                    )}
                </HorizontalCardContainer>
            </HorizontalCard>
        </Card>
    );
};

export default General;
