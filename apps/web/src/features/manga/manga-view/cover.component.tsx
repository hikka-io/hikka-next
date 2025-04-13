'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '../../../components/content-card/content-card';
import EditButton from '../../../components/edit-button';
import FavoriteButton from '../../../components/favorite-button';
import useSession from '../../../services/hooks/auth/use-session';
import useMangaInfo from '../../../services/hooks/manga/use-manga-info';

const Cover: FC = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();
    const { data: manga } = useMangaInfo({ slug: String(params.slug) });

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard imageProps={{ priority: true }} image={manga?.image}>
                <div className="absolute bottom-2 right-2 z-[1] flex gap-2">
                    {loggedUser && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type="manga"
                        />
                    )}
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type="manga"
                    />
                </div>

                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
