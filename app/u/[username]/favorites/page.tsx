import Favorites from '@/app/u/[username]/_layout/Favorites';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Улюблене',
    openGraph: {
        title: 'Улюблене',
    },
    twitter: {
        title: 'Улюблене',
    }
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Favorites extended />
        </div>
    );
};

export default Component;
