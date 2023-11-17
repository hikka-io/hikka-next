import Characters from '@/app/anime/[slug]/_layout/Characters';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Персонажі',
    openGraph: {
        title: "Персонажі",
    },
    twitter: {
        title: "Персонажі",
    },
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
};

export default Component;
