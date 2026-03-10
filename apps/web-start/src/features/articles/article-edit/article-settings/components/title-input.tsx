'use client';

import { FC } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useArticleContext } from '@/services/providers/article-provider';

interface Props {}

const TitleInput: FC<Props> = () => {
    const title = useArticleContext((state) => state.title);
    const setTitle = useArticleContext((state) => state.setTitle);

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Назва статті</Label>
            <Input
                placeholder="Введіть назву"
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
    );
};

export default TitleInput;
