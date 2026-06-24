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

    return <DescriptionBlock options={[{ text: character.description_ua }]} />;
};

export default Description;
