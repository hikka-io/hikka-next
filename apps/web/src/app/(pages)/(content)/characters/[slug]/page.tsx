import {
    CharacterAnime as Anime,
    CharacterDescription as Description,
    CharacterManga as Manga,
    CharacterNovel as Novel,
    CharacterVoices as Voices,
} from '@/features/characters';

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
