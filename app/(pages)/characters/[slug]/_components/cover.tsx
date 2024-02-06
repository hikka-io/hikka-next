'use client';

import { useParams } from 'next/navigation';

import { useCharacterInfo } from '@/app/page.hooks';
import BaseCard from '@/app/_components/ui/base-card';

const Component = () => {
    const params = useParams();

    const { data: character } = useCharacterInfo(String(params.slug));

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