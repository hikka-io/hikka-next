import Anime from '@/features/characters/components/anime';
import Description from '@/features/characters/components/description';
import Manga from '@/features/characters/components/manga';
import Novel from '@/features/characters/components/novel';
import Voices from '@/features/characters/components/voices';

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
