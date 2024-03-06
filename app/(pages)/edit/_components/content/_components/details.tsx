import * as React from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    content: API.AnimeInfo | API.Character;
}

const Component = ({ content }: Props) => {
    const title_ua = 'title_ua' in content ? content.title_ua : content.name_ua;
    const title_en = 'title_en' in content ? content.title_en : content.name_en;
    const title_ja = 'title_ja' in content ? content.title_ja : content.name_ja;

    return (
        <div className="bg-secondary/30 border border-secondary/60 p-4 rounded-md flex flex-col gap-4">
            <div className="flex-col gap-2">
                <Label className="text-muted-foreground">
                    Назва українською
                </Label>
                <p className="text-sm">{title_ua || '-'}</p>
            </div>
            <div className="flex-col gap-2">
                <Label className="text-muted-foreground">
                    Назва англійською
                </Label>
                <p className="text-sm">{title_en || '-'}</p>
            </div>
            <div className="flex-col gap-2">
                <Label className="text-muted-foreground">Назва оригіналу</Label>
                <p className="text-sm">{title_ja || '-'}</p>
            </div>
        </div>
    );
};

export default Component;
