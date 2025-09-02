import Anime from '@/features/people/components/anime';
import Characters from '@/features/people/components/characters';
import Manga from '@/features/people/components/manga';
import Novel from '@/features/people/components/novel';

const PersonPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Characters />
            <Anime />
            <Manga />
            <Novel />
        </div>
    );
};

export default PersonPage;
