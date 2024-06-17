import { FC } from 'react';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';

import { getTitle } from '@/utils/title-adapter';

interface Props {
    content: API.MainContent;
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
        <div className="flex flex-col gap-4 rounded-md border border-secondary/60 bg-secondary/30 p-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {'title_ua' in content ? 'Назва' : 'Імʼя'} українською
                </Label>
                <P className="text-sm">{title_ua || '-'}</P>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {'title_en' in content ? 'Назва' : 'Імʼя'} англійською
                </Label>
                <P className="text-sm">{title_en || '-'}</P>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {'title_ja' in content ? 'Назва оригіналу' : 'Рідне імʼя'}
                </Label>
                <P className="text-sm">{title_ja || '-'}</P>
            </div>
        </div>
    );
};

export default Details;
