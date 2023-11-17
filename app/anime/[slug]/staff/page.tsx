import Staff from '@/app/anime/[slug]/_layout/Staff';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Автори',
    openGraph: {
        title: 'Автори',
    },
    twitter: {
        title: 'Автори',
    }
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended />
        </div>
    );
};

export default Component;
