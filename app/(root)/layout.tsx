import Filters from '@/app/(root)/layout/Filters';
import { ReactNode } from 'react';

interface Props {
    list: ReactNode;
}

const Component = ({ list }: Props) => {
    return (
        <section className="mt-24 flex flex-col items-center justify-center md:flex-auto md:flex-row md:items-baseline md:justify-between md:gap-x-12">
            <div className="md:w-2/3">{list}</div>
            <div className="order-1 mr-0 md:order-2 md:mr-6 md:w-80">
                <Filters />
            </div>
        </section>
    );
};

export default Component;
