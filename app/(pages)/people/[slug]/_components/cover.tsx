'use client';

import { useParams } from 'next/navigation';

import BaseCard from '@/components/ui/base-card';
import usePersonInfo from '@/services/hooks/people/usePersonInfo';

const Component = () => {
    const params = useParams();

    const { data: person } = usePersonInfo({ slug: String(params.slug) });

    if (!person) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <BaseCard poster={person.image} />
        </div>
    );
};

export default Component;
