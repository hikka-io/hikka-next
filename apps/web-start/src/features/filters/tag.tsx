'use client';

import type { FC } from 'react';

import { Tag as TagIcon } from 'lucide-react';

import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

type Props = {
    className?: string;
};

const Tag: FC<Props> = () => {
    const { tags = [] } = useFilterSearch<{ tags?: string[] }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <TagIcon className="size-4 shrink-0" />
                <Label>Теги</Label>
            </div>
            <InputTags
                disabled={tags.length === 3}
                id="tags"
                value={tags}
                onChange={(tags) => handleChangeParam('tags', tags as string[])}
            />
        </div>
    );
};

export default Tag;
