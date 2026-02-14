'use client';

import { Tag as TagIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Label } from '@/components/ui/label';
import { InputTags } from '@/components/ui/input-tags';

import { useChangeParam } from '@/features/filters';

interface Props {
    className?: string;
}

const Tag: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const tags = searchParams.getAll('tags');

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
                onChange={(tags) =>
                    handleChangeParam('tags', tags as string[])
                }
            />
        </div>
    );
};

export default Tag;
