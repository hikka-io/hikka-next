import Characters from '../layout/Characters';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    params: { slug: string };
}

const Component = async ({ params: { slug } }: Props) => {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended />
        </div>
    );
};

export default Component;
