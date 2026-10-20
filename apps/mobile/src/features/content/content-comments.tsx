import type { FC } from 'react';

import { View } from 'react-native';

import { CommentsPreview } from '@/features/comments';

import { useVisibleOnce } from './detail-scroll';
import type { ContentInfo } from './queries';

type Props = {
    content: ContentInfo;
};

/** The web's comment block, last on the page like the web's single-column layout. */
const ContentComments: FC<Props> = ({ content }) => {
    const { onLayout, visible } = useVisibleOnce();

    return (
        <View onLayout={onLayout}>
            <CommentsPreview
                contentType={content.data_type}
                slug={content.slug}
                commentsCount={content.comments_count}
                enabled={visible}
            />
        </View>
    );
};

export default ContentComments;
