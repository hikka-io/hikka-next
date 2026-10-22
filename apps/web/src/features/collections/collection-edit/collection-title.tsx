import type { FC } from 'react';

import { API_LIMITS } from '@hikka/api';

import InlineTitleInput from '@/components/inline-title-input';
import TagsInput from '@/components/tags-input';
import { Badge } from '@/components/ui/badge';

import { useCollectionContext } from './collection-provider';

/** The title, then the flags and tags in the order the collection page shows them. */
const CollectionEditTitle: FC = () => {
    const title = useCollectionContext((state) => state.title);
    const spoiler = useCollectionContext((state) => state.spoiler);
    const nsfw = useCollectionContext((state) => state.nsfw);
    const tags = useCollectionContext((state) => state.tags);
    const setTitle = useCollectionContext((state) => state.setTitle);
    const setTags = useCollectionContext((state) => state.setTags);

    return (
        <div className="flex flex-col gap-3">
            <InlineTitleInput
                placeholder="Назва колекції"
                maxLength={API_LIMITS.collectionTitle.max}
                value={title}
                onValueChange={setTitle}
            />
            <div className="flex flex-wrap items-center gap-2">
                {spoiler && <Badge variant="warning">Спойлери</Badge>}
                {nsfw && <Badge variant="destructive">+18</Badge>}
                <TagsInput
                    tags={tags}
                    onChange={setTags}
                    className="contents"
                />
            </div>
        </div>
    );
};

export default CollectionEditTitle;
