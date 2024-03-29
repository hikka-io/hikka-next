import EntryCard from '@/components/entry-card/entry-card';
import FavoriteButton from '@/components/favorite-button';

interface Props {
    anime?: API.AnimeInfo;
}

const Cover = ({ anime }: Props) => {
    if (!anime) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <EntryCard poster={anime.poster}>
                <div className="absolute bottom-2 right-2 z-[1]">
                    <FavoriteButton slug={anime.slug} content_type="anime" />
                </div>
                
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </EntryCard>
        </div>
    );
};

export default Cover;
