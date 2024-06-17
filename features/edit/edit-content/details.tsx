import { FC } from 'react';

import P from '@/components/typography/p';
import HorizontalContentCard from '@/components/ui/horizontal-content-card';

import { getTitle } from '@/utils/title-adapter';

interface Props {
    content: API.MainContent;
    href: string;
    poster: string;
}

const Details: FC<Props> = ({ content }) => {
    const title_ua = getTitle({
        data: content,
        titleLanguage: content.data_type === 'anime' ? 'title_ua' : 'name_ua',
    });
    const title_en = getTitle({
        data: content,
        titleLanguage: content.data_type === 'anime' ? 'title_en' : 'name_en',
    });
    const title_ja = getTitle({
        data: content,
        titleLanguage:
            content.data_type === 'anime'
                ? 'title_ja'
                : content.data_type === 'manga' || content.data_type === 'novel'
                  ? 'title_original'
                  : 'name_ja',
    });

    return (
        <HorizontalContentCard
            href={href}
            image={poster}
            title={title_ua || title_en || title_ja}
            size="sm"
        >
            <div className="flex flex-col text-xs text-muted-foreground h-full">
                <P className="line-clamp-1">
                    {title_ua !== null
                        ? title_en
                        : title_en !== null
                          ? title_ja
                          : null}
                </P>
                <P className="line-clamp-1">
                    {title_en === null
                        ? title_ua === null
                            ? title_ja
                            : null
                        : title_ua !== null
                          ? title_ja
                          : null}
                </P>
            </div>
        </HorizontalContentCard>
    );
};

export default Details;
