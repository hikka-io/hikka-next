import type { FC } from 'react';

import { Tag as TagIcon } from 'lucide-react';

import { API_LIMITS } from '@hikka/api';

import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { useRouteSearch } from '@/utils/navigation';
import type { ArticlesSearch } from '@/utils/search-schemas';

import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const TagFilter: FC<Props> = () => {
    const { tags = [] } = useRouteSearch<Pick<ArticlesSearch, 'tags'>>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <TagIcon className="size-4 shrink-0" />
                <Label>Теги</Label>
            </div>
            <InputTags
                disabled={tags.length === API_LIMITS.tags.max}
                id="tags"
                value={tags}
                onChange={(tags) => handleChangeParam('tags', tags as string[])}
            />
        </div>
    );
};

export default TagFilter;
