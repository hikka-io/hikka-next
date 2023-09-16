'use client'

import MiFeatureSearch from '@/app/components/icons/MiFeatureSearch';
import {usePathname, useRouter} from "next/navigation";
import AiClearOutlined from "@/app/components/icons/AiClearOutlined";

interface Props {}

const Component = ({ ...props }: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="flex justify-between items-center md:flex-row flex-col gap-4 rounded-lg border border-secondary/30 p-6">
            <div className="flex gap-4 items-center">
                <MiFeatureSearch className="text-4xl opacity-60" />
                <div className="flex flex-col gap-1">
                    <h3 className="opacity-60">No results were found for your request</h3>
                    <p className="opacity-30">Clear or modify your filters to change the result</p>
                </div>
            </div>
            <button
                onClick={() => router.push(pathname)}
                className="btn btn-error w-full md:w-auto"
            >
                <AiClearOutlined />
                Clear Filters
            </button>
        </div>
    );
};

export default Component;
