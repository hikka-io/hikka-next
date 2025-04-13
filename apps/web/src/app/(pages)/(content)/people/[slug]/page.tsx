import Anime from '@/features/people/person-view/anime.component';
import Characters from '@/features/people/person-view/characters.component';
import Manga from '@/features/people/person-view/manga.component';
import Novel from '@/features/people/person-view/novel.component';

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
