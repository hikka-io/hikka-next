import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Label } from '@/components/ui/label';

interface Props {
    image: string;
    title: string;
}

const General: FC<Props> = ({ title, image }) => {
    return (
        <>
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <ContentCard image={image} />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <ContentCard image={image} />
                </div>
                <Label>{title}</Label>
            </div>
        </>
    );
};

export default General;
