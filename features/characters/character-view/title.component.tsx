'use client';

import { useParams } from 'next/navigation';

import EditButton from '@/components/edit-button';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

import useSession from '@/services/hooks/auth/use-session';
import useCharacterInfo from '@/services/hooks/characters/use-character-info';

const Title = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();
    const { data: character } = useCharacterInfo({ slug: String(params.slug) });

    if (!character) {
        return null;
    }

    const name =
        character.name_ua || character.name_en || character.name_ja || '';
    const otherLanguagesName =
        name === character.name_en
            ? character.name_ja
            : `${character.name_ja} / ${character.name_en}`;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <div className="flex gap-4">
                        <H2>{name}</H2>
                        {loggedUser && (
                            <EditButton
                                key={String(params.slug)}
                                slug={String(params.slug)}
                                content_type="character"
                                className="hidden lg:flex"
                            />
                        )}
                    </div>
                    <P className="mt-2">{otherLanguagesName}</P>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {loggedUser && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type="character"
                            className="flex lg:hidden"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Title;
