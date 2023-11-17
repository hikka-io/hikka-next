import Franchise from '@/app/anime/[slug]/_layout/Franchise';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Пов'язане",
    openGraph: {
        title: "Пов'язане",
    },
    twitter: {
        title: "Пов'язане",
    },
};

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Franchise extended />
        </div>
    );
};

export default Component;
