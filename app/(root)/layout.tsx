import Filters from './layout/Filters';
import NavBar from './layout/NavBar';
import { ReactNode } from 'react';

interface Props {
    list: ReactNode;
}

const Component = ({ list }: Props) => {
    return (
        <div className="md:mt-24">
            <div className="drawer drawer-end">
                <input
                    id="filterDrawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content grid grid-cols-1 md:grid-cols-[1fr_25%] justify-center md:items-start md:justify-between md:gap-12">
                    <div className="flex flex-col gap-8">
                        <div className="sticky md:relative top-[calc(5rem-1px)] md:top-0 z-[1] -mx-4">
                            <NavBar />
                        </div>
                        {list}
                    </div>
                    <div className="order-1 md:order-2 md:sticky md:top-[calc(5rem-1px)] md:flex hidden">
                        <Filters />
                    </div>
                </div>
                <div className="drawer-side overflow-y-visible z-10 md:hidden">
                    <label
                        htmlFor="filterDrawer"
                        className="drawer-overlay"
                    ></label>
                    <div className="p-4 w-80 overflow-y-scroll overscroll-contain h-full bg-black text-base-content">
                        <Filters />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
