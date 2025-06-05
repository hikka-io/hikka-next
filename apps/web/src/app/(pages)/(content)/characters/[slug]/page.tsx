import Anime from '@/features/characters/character-view/anime.component';
import Description from '@/features/characters/character-view/description.component';
import Manga from '@/features/characters/character-view/manga.component';
import Novel from '@/features/characters/character-view/novel.component';
import Voices from '@/features/characters/character-view/voices.component';

const CharacterPage = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Description />
            <Anime />
            <Manga />
            <Novel />
            <Voices />
        </div>
    );
};

export default CharacterPage;
