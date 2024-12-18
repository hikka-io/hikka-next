import { FC, PropsWithChildren } from 'react';
import MaterialSymbolsCalendarClockRounded from '~icons/material-symbols/calendar-clock-rounded';
import MaterialSymbolsCategoryOutlineRounded from '~icons/material-symbols/category-outline-rounded';

import Card from '@/components/ui/card';
import HorizontalCard from '@/components/ui/horizontal-card';

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
            <HorizontalCard
                image={image}
                imageContainerClassName="w-14"
                title="Інформація"
                titleClassName="font-semibold"
                description={
                    <div className="flex gap-1">
                        <MaterialSymbolsCategoryOutlineRounded className="size-4 text-muted-foreground" />
                        {CONTENT_TYPES[content_type].title_ua}
                    </div>
                }
                meta={
                    (content.data_type === 'anime' ||
                        content.data_type === 'manga' ||
                        content.data_type === 'novel') && (
                        <div className="flex cursor-default items-center gap-1.5 font-medium">
                            <MaterialSymbolsCalendarClockRounded className="size-4 text-muted-foreground" />
                            {content.year}
                        </div>
                    )
                }
                href={link || '#'}
            />
        </Card>
    );
};

export default General;
