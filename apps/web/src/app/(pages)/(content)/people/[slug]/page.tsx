import Anime from '@/features/people/person-view/anime';
import Characters from '@/features/people/person-view/characters';
import Manga from '@/features/people/person-view/manga';
import Novel from '@/features/people/person-view/novel';

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
