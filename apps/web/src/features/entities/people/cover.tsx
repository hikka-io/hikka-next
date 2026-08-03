import { useQuery } from '@tanstack/react-query';

import { personInfoOptions } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { useParams } from '@/utils/navigation';

const Cover = () => {
    const params = useParams();

    const { data: person } = useQuery(
        personInfoOptions({ path: { slug: String(params.slug) } }),
    );

    if (!person) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <PosterCard image={person.image} imagePreset="cardLg" />
        </div>
    );
};

export default Cover;
