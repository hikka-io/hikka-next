'use client';

import { useParams } from 'next/navigation';

import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import useCharacterInfo from '@/services/hooks/characters/use-character-info';

const Title = () => {
    const params = useParams();
    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <H2>
                        {character.name_ua ||
                            character.name_en ||
                            character.name_ja ||
                            ''}{' '}
                    </H2>

                    <P className="mt-2">{character.name_ja}</P>
                </div>
            </div>
        </div>
    );
};

export default Title;
