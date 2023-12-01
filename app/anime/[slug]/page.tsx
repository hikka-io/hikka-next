import About from '@/app/anime/[slug]/_layout/About';
import Description from '@/app/anime/[slug]/_layout/Description';
import Links from '@/app/anime/[slug]/_layout/Links';
import Characters from '@/app/anime/[slug]/_layout/Characters';
import Franchise from '@/app/anime/[slug]/_layout/Franchise';
import Staff from '@/app/anime/[slug]/_layout/Staff';
import Media from "@/app/anime/[slug]/_layout/Media";
import Comments from "@/app/anime/[slug]/_layout/Comments";

const Component = () => {
    return (
        <div className="flex flex-col gap-12">

            <Description />
            <Characters />
            <Franchise />
            <Media />
            <Staff />
            <Links />
            <Comments />
        </div>
    );
};

export default Component;
