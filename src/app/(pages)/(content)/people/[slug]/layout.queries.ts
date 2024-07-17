import { prefetchPersonAnime } from '@/services/hooks/people/use-person-anime';
import { prefetchPersonCharacters } from '@/services/hooks/people/use-person-characters';
import { prefetchPersonManga } from '@/services/hooks/people/use-person-manga';
import { prefetchPersonNovel } from '@/services/hooks/people/use-person-novel';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    await Promise.all([
        prefetchPersonAnime({ slug }),
        prefetchPersonManga({ slug }),
        prefetchPersonNovel({ slug }),
        prefetchPersonCharacters({ slug }),
    ]);
};

export default prefetchQueries;
