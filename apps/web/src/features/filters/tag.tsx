import type { FC } from 'react';

import { Tag as TagIcon } from 'lucide-react';

import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { useRouteSearch } from '@/utils/navigation';

import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const TagFilter: FC<Props> = () => {
    const { tags = [] } = useRouteSearch<{ tags?: string[] }>();

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

export default TagFilter;
