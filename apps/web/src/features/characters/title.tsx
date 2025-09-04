'use client';

import { useCharacterBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

const Title = () => {
    const params = useParams();
    const { data: character } = useCharacterBySlug({
        slug: String(params.slug),
    });

    if (!character) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <H2>{character.title}</H2>

                    <P className="mt-2">{character.name_ja}</P>
                </div>
            </div>
        </div>
    );
};

export default Title;
