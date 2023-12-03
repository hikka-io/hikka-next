import ListStats from './_layout/ListStats';
import Favorites from './_layout/Favorites';

const Component = () => {
    return (
        <div className="flex flex-col gap-12">
            <ListStats />
            <Favorites />
        </div>
    );
};

export default Component;
