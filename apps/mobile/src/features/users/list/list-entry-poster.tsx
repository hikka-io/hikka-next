import type { FC } from 'react';

import { View } from 'react-native';

import type { MainContentTypeEnum } from '@hikka/api';
import { getMediaTypeLabel, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { IconStatusButton } from '@/components/tracking';
import { contentHref } from '@/utils/content-href';

import type { UserListEntry } from '../queries';
import { entryContent } from './list-entry';

type Props = {
    entry: UserListEntry;
    contentType: MainContentTypeEnum;
    owner: boolean;
};

/**
 * The web's grid card. On the owner's list the row is the viewer's own entry, so it is passed
 * as `entry` and the overlay opens the edit sheet without a per-card fetch; another user's entry
 * is never the viewer's, so their cards get no tracking overlay.
 */
const ListEntryPoster: FC<Props> = ({ entry, contentType, owner }) => {
    const content = entryContent(entry);
    const year = 'year' in content ? content.year : null;

    return (
        <PosterCard
            href={contentHref(contentType, content.slug)}
            title={getTitle(content)}
            image={content.image ?? undefined}
            leftSubtitle={year ? String(year) : null}
            rightSubtitle={getMediaTypeLabel(content.media_type)}
            overlay={
                owner ? (
                    <View className="absolute right-1 bottom-1">
                        <IconStatusButton
                            contentType={contentType}
                            slug={content.slug}
                            entry={entry}
                        />
                    </View>
                ) : undefined
            }
        />
    );
};

export default ListEntryPoster;
