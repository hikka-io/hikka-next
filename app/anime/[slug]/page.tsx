import About from './layout/About';
import Description from './layout/Description';
import Links from './layout/Links';
import Characters from './layout/Characters';
import Franchise from './layout/Franchise';
import Staff from './layout/Staff';
import Media from "@/app/anime/[slug]/layout/Media";

interface Props {
    params: { slug: string };
}

const Component = ({ params: { slug } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <About />
            <Description />
            <Characters />
            <Franchise />
            <Media />
            <Staff />
            <Links />
        </div>
    );
};

export default Component;
