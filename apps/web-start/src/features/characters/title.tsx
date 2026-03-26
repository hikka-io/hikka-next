'use client';

import { useCharacterBySlug, useTitle } from '@hikka/react';

import { useParams } from '@/utils/navigation';

const Title = () => {
    const params = useParams();
    const { data: character } = useCharacterBySlug({
        slug: String(params.slug),
    });
    const title = useTitle(character);

    if (!character) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <h2>{title}</h2>
                    <p className="text-muted-foreground text-sm">
                        {character.name_ja}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Title;
