'use client';

import { ContentTypeEnum } from '@hikka/client';
import { usePersonBySlug, useSession } from '@hikka/react';
import { useParams } from 'next/navigation';

import ContentCard from '@/components/content-card/content-card';
import EditButton from '@/components/edit-button';

const Cover = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();

    const { data: person } = usePersonBySlug({ slug: String(params.slug) });

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
                            content_type={ContentTypeEnum.PERSON}
                        />
                    )}
                </div>

                <div className="from-background absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
