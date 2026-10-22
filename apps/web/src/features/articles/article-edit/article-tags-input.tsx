import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleTopOptions } from '@hikka/api';

import TagsInput from '@/components/tags-input';

import { useArticleContext } from './article-provider';

const ArticleTagsInput: FC = () => {
    const tags = useArticleContext((state) => state.tags);
    const setTags = useArticleContext((state) => state.setTags);
    const [suggest, setSuggest] = useState(false);

    const { data: top } = useQuery({
        ...getArticleTopOptions(),
        enabled: suggest,
    });

    return (
        <TagsInput
            tags={tags}
            onChange={setTags}
            suggestions={top?.tags.map((tag) => tag.name)}
            onEditStart={() => setSuggest(true)}
        />
    );
};

export default ArticleTagsInput;
