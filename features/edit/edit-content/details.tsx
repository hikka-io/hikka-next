import { FC } from 'react';

import P from '@/components/typography/p';
import HorizontalContentCard from '@/components/ui/horizontal-content-card';

interface Props {
    content: API.MainContent;
    href: string;
    poster: string;
}

const Details: FC<Props> = ({ content, href, poster }) => {
    const title_ua = 'title_ua' in content ? content.title_ua : content.name_ua;
    const title_en =
        'title_en' in content ? content?.title_en : content?.name_en;
    const title_ja =
        'title_ja' in content
            ? content.title_ja
            : 'title_original' in content
              ? content.title_original
              : 'name_ja' in content
                ? content.name_ja
                : content.name_native;

    console.log(title_en, title_ua, title_ja);

    return (
        <HorizontalContentCard
            href={href}
            image={poster}
            title={title_ua || title_en || title_ja}
            size="sm"
        >
            <div className="flex h-full flex-col text-xs text-muted-foreground">
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
