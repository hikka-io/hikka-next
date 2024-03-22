import FavoriteButton from '@/components/favorite-button';
import EntryCard from '@/components/entry-card/entry-card';

interface Props {
    anime?: API.AnimeInfo;
}

const Component = ({ anime }: Props) => {
    if (!anime) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <EntryCard poster={anime.poster}>
                <FavoriteButton slug={anime.slug} content_type="anime" />
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </EntryCard>
        </div>
    );
};

export default Component;
