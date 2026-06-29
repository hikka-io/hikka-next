import { useQuery } from '@tanstack/react-query';

import { characterInfoOptions } from '@hikka/api';

import DescriptionBlock from '@/components/description-block';
import { useParams } from '@/utils/navigation';

const Description = () => {
    const params = useParams();
    const { data: character } = useQuery(
        characterInfoOptions({ path: { slug: String(params.slug) } }),
    );

    if (!character) {
        return null;
    }

    return <DescriptionBlock options={[{ text: character.description_ua }]} />;
};

export default Description;
