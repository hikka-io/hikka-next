'use client';

import { useCharacterBySlug } from '@hikka/react';

import DescriptionBlock from '@/components/content/description-block';

import { useParams } from '@/utils/navigation';

const Description = () => {
    const params = useParams();
    const { data: character } = useCharacterBySlug({
        slug: String(params.slug),
    });

    if (!character) {
        return null;
    }

    return (
        <DescriptionBlock
            options={[
                {
                    value: 'description_ua',
                    label: 'UA',
                    ariaLabel: 'Опис українською',
                    text: character.description_ua,
                },
            ]}
        />
    );
};

export default Description;
