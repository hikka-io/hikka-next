import type { FC } from 'react';

import { API_LIMITS } from '@hikka/api';

import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';

import { useArticleContext } from '../../article-provider';

type Props = {};

const TagsInput: FC<Props> = () => {
    const tags = useArticleContext((state) => state.tags);
    const setTags = useArticleContext((state) => state.setTags);

    return (
        <div className="flex flex-col gap-4">
            <Label htmlFor="tags" className="text-muted-foreground">
                Теги
            </Label>
            <InputTags
                disabled={tags.length === API_LIMITS.tags.max}
                id="tags"
                value={tags}
                onChange={(tags) => setTags(tags as string[])}
            />
        </div>
    );
};

export default TagsInput;
