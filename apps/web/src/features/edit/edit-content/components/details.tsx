import type { FC } from 'react';

import { Label } from '@/components/ui/label';

import type { EditMainContent } from '../../types';

type Props = {
    content: EditMainContent;
};

const Details: FC<Props> = ({ content }) => {
    const title_en = 'title_en' in content ? content.title_en : content.name_en;
    const title_original =
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
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {isPerson ? 'Імʼя' : 'Назва'} англійською
                </Label>
                <p className="text-sm">{title_en || '—'}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    {isPerson ? 'Оригінальне імʼя' : 'Оригінальна назва'}
                </Label>
                <p className="text-sm">{title_original || '—'}</p>
            </div>
        </div>
    );
};

export default Details;
