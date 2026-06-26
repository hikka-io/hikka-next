import type { FC, PropsWithChildren } from 'react';

import { type EditContentTypeEnum, ContentTypeEnum } from '@hikka/api';

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

import type { EditMainContent } from '../../types';

type Props = PropsWithChildren & {
    content: EditMainContent;
    content_type: EditContentTypeEnum;
    slug: string;
};

const General: FC<Props> = ({ content, content_type, slug }) => {
    const image = content.image;
    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Card className="w-full">
            <HorizontalCard>
                <HorizontalCardImage
                    image={image}
                    className="w-14"
                    href={link || '#'}
                />
                <HorizontalCardContainer>
                    <HorizontalCardTitle href={link || '#'}>
                        Інформація
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        <MaterialSymbolsCategoryOutlineRounded className="size-4 text-muted-foreground" />
                        {CONTENT_TYPES[content_type].title_ua}
                    </HorizontalCardDescription>
                    {(content.data_type === ContentTypeEnum.ANIME ||
                        content.data_type === ContentTypeEnum.MANGA ||
                        content.data_type === ContentTypeEnum.NOVEL) && (
                        <HorizontalCardDescription>
                            <MaterialSymbolsCalendarClockRounded className="size-4 text-muted-foreground" />
                            {'year' in content ? content.year : null}
                        </HorizontalCardDescription>
                    )}
                </HorizontalCardContainer>
            </HorizontalCard>
        </Card>
    );
};

export default General;
