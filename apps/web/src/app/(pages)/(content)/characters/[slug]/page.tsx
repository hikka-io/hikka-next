import Anime from '@/features/characters/character-view/anime';
import Description from '@/features/characters/character-view/description';
import Manga from '@/features/characters/character-view/manga';
import Novel from '@/features/characters/character-view/novel';
import Voices from '@/features/characters/character-view/voices';

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
