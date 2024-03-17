import * as React from 'react';

import { Label } from '@/components/ui/label';
import P from '@/components/typography/p';

interface Props {
    content: API.AnimeInfo | API.Character;
}

const Component = ({ content }: Props) => {
    const title_ua = 'title_ua' in content ? content.title_ua : content.name_ua;
    const title_en = 'title_en' in content ? content.title_en : content.name_en;
    const title_ja = 'title_ja' in content ? content.title_ja : content.name_ja;

    return (
        <div className="flex flex-col gap-4 rounded-md border border-secondary/60 bg-secondary/30 p-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    Назва українською
                </Label>
                <P className="text-sm">{title_ua || '-'}</P>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                    Назва англійською
                </Label>
                <P className="text-sm">{title_en || '-'}</P>
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Назва оригіналу</Label>
                <P className="text-sm">{title_ja || '-'}</P>
            </div>
        </div>
    );
};

export default Component;
