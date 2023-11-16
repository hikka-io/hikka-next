import Media from '@/app/anime/[slug]/_layout/Media';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Медіа',
}

const Component = async () => {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
};

export default Component;
