import { useQuery } from '@tanstack/react-query';

import { characterInfoOptions } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { useParams } from '@/utils/navigation';

const Cover = () => {
    const params = useParams();

    const { data: character } = useQuery(
        characterInfoOptions({ path: { slug: String(params.slug) } }),
    );

    if (!character) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <PosterCard image={character.image} imagePreset="cardLg" />
        </div>
    );
};

export default Cover;
