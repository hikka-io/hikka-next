import {
    PersonAnime as Anime,
    PersonCharacters as Characters,
    PersonManga as Manga,
    PersonNovel as Novel,
} from '@/features/people';

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
