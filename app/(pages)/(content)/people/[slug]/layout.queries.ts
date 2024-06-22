import { prefetchPersonAnime } from '@/services/hooks/people/use-person-anime';
import { prefetchPersonCharacters } from '@/services/hooks/people/use-person-characters';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    await Promise.all([
        prefetchPersonAnime({ slug }),
        prefetchPersonCharacters({ slug }),
    ]);
};

export default prefetchQueries;
