import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { CommentList } from '@/features/comments';
import { ContentCollections, ContentDetails } from '@/features/content';

import PersonAnime from './people/anime';
import PersonCharacters from './people/characters';
import PersonCover from './people/cover';
import PersonManga from './people/manga';
import PersonNovel from './people/novel';
import PersonTitle from './people/title';

type Props = {
    slug: string;
};

const PersonDetailPage: FC<Props> = ({ slug }) => {
    const detailsContentType = ContentTypeEnum.PERSON;

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-4">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <PersonCover />
            </div>
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-8">
                <PersonTitle />
                <ContentDetails
                    className="lg:hidden"
                    content_type={detailsContentType}
                />
                <PersonCharacters />
                <PersonAnime />
                <PersonManga />
                <PersonNovel />
                <div className="order-last lg:order-0">
                    <CommentList
                        preview
                        slug={slug}
                        content_type={ContentTypeEnum.PERSON}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-8 lg:col-span-1">
                <ContentDetails
                    className="hidden lg:flex"
                    content_type={detailsContentType}
                />
                <ContentCollections content_type={ContentTypeEnum.PERSON} />
            </div>
        </div>
    );
};

export default PersonDetailPage;
