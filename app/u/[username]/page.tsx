import ListStats from '@/app/u/[username]/_layout/ListStats';
import Favorites from '@/app/u/[username]/_layout/Favorites';

const Component = () => {
    return (
        <div className="flex flex-col gap-12">
            <ListStats />
            <Favorites />
        </div>
    );
};

export default Component;
