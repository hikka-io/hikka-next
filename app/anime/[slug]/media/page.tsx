import { PropsWithChildren } from 'react';
import Media from '../layout/Media';

interface Props extends PropsWithChildren {
    params: { slug: string };
}

const Component = async ({ params: { slug } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
};

export default Component;
