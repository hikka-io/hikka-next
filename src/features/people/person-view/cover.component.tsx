'use client';

import { useParams } from 'next/navigation';

import ContentCard from '@/components/content-card/content-card';
import EditButton from '@/components/edit-button';
import FavoriteButton from '@/components/favorite-button';

import useSession from '@/services/hooks/auth/use-session';
import usePersonInfo from '@/services/hooks/people/use-person-info';

const Cover = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();

    const { data: person } = usePersonInfo({ slug: String(params.slug) });

    if (!person) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard image={person.image}>
                <div className="absolute bottom-2 right-2 z-[1] flex gap-2">
                    {loggedUser && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type="person"
                        />
                    )}
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type="person"
                    />
                </div>

                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
