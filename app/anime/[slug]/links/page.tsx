import Links from '@/app/anime/[slug]/_layout/Links';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Посилання',
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Links extended />
        </div>
    );
};

export default Component;
