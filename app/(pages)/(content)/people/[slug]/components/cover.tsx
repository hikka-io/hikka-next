'use client';

import { useParams } from 'next/navigation';

import ContentCard from '@/components/content-card/content-card';
import usePersonInfo from '@/services/hooks/people/usePersonInfo';

const Cover = () => {
    const params = useParams();

    const { data: person } = usePersonInfo({ slug: String(params.slug) });

    if (!person) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard poster={person.image} />
        </div>
    );
};

export default Cover;
