import { MainContent } from '@hikka/client';
import { FC } from 'react';

import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
    content: MainContent;
}

const Details: FC<Props> = ({ content }) => {
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

    const isPerson =
        content.data_type === 'person' || content.data_type === 'character';

    return (
        <Card className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {isPerson ? 'Імʼя' : 'Назва'} українською
                </Label>
                <P className="text-sm">{title_ua || '-'}</P>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {isPerson ? 'Імʼя' : 'Назва'} англійською
                </Label>
                <P className="text-sm">{title_en || '-'}</P>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {isPerson ? 'Оригінальне' : 'Оригінальна'}{' '}
                    {isPerson ? 'імʼя' : 'назва'}
                </Label>
                <P className="text-sm">{title_ja || '-'}</P>
            </div>
        </Card>
    );
};

export default Details;
