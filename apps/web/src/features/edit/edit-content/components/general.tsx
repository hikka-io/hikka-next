import type { FC } from 'react';

import { ContentTypeEnum, type EditContentTypeEnum } from '@hikka/api';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsCategoryOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsCategoryOutlineRounded';
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

type Props = {
    content: EditMainContent;
    content_type: EditContentTypeEnum;
    slug: string;
};

const General: FC<Props> = ({ content, content_type, slug }) => {
    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const title_ua = 'title_ua' in content ? content.title_ua : content.name_ua;
    const title_en = 'title_en' in content ? content.title_en : content.name_en;
    const title_original =
        'title_ja' in content
            ? content.title_ja
            : 'title_original' in content
              ? content.title_original
              : 'name_ja' in content
                ? content.name_ja
                : content.name_native;

    const heading = title_ua || title_en || title_original || '—';

    const hasYear =
        (content.data_type === ContentTypeEnum.ANIME ||
            content.data_type === ContentTypeEnum.MANGA ||
            content.data_type === ContentTypeEnum.NOVEL) &&
        'year' in content &&
        Boolean(content.year);

    return (
        <HorizontalCard>
            <HorizontalCardImage
                image={content.image}
                className="w-12"
                href={link}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle href={link} target="_blank">
                    {heading}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    <MaterialSymbolsCategoryOutlineRounded className="size-4 text-muted-foreground" />
                    {CONTENT_TYPES[content_type].title_ua}
                    {hasYear && (
                        <>
                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                            <MaterialSymbolsCalendarClockRounded className="size-4 text-muted-foreground" />
                            {'year' in content ? content.year : null}
                        </>
                    )}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default General;
