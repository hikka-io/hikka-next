import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { CommentList } from '@/features/comments';
import { ContentCollections, ContentDetails } from '@/features/content';

import CharacterAnime from './characters/anime';
import CharacterCover from './characters/cover';
import CharacterDescription from './characters/description';
import CharacterManga from './characters/manga';
import CharacterNovel from './characters/novel';
import CharacterTitle from './characters/title';
import CharacterVoices from './characters/voices';

type Props = {
    slug: string;
};

const CharacterDetailPage: FC<Props> = ({ slug }) => {
    const detailsContentType = ContentTypeEnum.CHARACTER;

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-4">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <CharacterCover />
            </div>
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-8">
                <CharacterTitle />
                <CharacterDescription />
                <ContentDetails
                    className="lg:hidden"
                    content_type={detailsContentType}
                />
                <CharacterAnime />
                <CharacterManga />
                <CharacterNovel />
                <CharacterVoices />
                <div className="order-last lg:order-0">
                    <CommentList
                        preview
                        slug={slug}
                        content_type={ContentTypeEnum.CHARACTER}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-8 lg:col-span-1">
                <ContentDetails
                    className="hidden lg:flex"
                    content_type={detailsContentType}
                />
                <ContentCollections content_type={ContentTypeEnum.CHARACTER} />
            </div>
        </div>
    );
};

export default CharacterDetailPage;
