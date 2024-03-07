'use client';

import { useParams } from 'next/navigation';

import BaseCard from '@/components/ui/base-card';
import useCharacterInfo from '@/services/hooks/characters/useCharacterInfo';

const Component = () => {
    const params = useParams();

    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <BaseCard poster={character.image}></BaseCard>
        </div>
    );
};

export default Component;
