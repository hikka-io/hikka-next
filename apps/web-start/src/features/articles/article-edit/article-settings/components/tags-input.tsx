'use client';

import { FC } from 'react';

import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';

import { useArticleContext } from '@/services/providers/article-provider';

interface Props {}

const TagsInput: FC<Props> = () => {
    const tags = useArticleContext((state) => state.tags);
    const setTags = useArticleContext((state) => state.setTags);

    return (
        <div className="flex flex-col gap-4">
            <Label htmlFor="tags" className="text-muted-foreground">
                Теги
            </Label>
            <InputTags
                disabled={tags.length === 3}
                id="tags"
                value={tags}
                onChange={(tags) => setTags(tags as string[])}
            />
        </div>
    );
};

export default TagsInput;
