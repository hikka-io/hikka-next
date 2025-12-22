'use client';

import { FC } from 'react';

import Image from '@/components/ui/image';

interface Props {
    cover?: string | null;
    position?: 'top' | 'center' | 'bottom';
}

const CoverImage: FC<Props> = ({ cover, position = 'center' }) => {
    if (!cover) return null;

    const getPositionClass = () => {
        switch (position) {
            case 'top':
                return 'object-top';
            case 'bottom':
                return 'object-bottom';
            case 'center':
            default:
                return 'object-center';
        }
    };

    return (
        <div
            data-cover-image
            className="absolute left-0 top-0 -z-20 h-80 w-full overflow-hidden opacity-40 gradient-mask-b-0"
        >
            <Image
                src={cover}
                className={`relative size-full object-cover ${getPositionClass()}`}
                alt="cover"
                fill
                loading="lazy"
            />
        </div>
    );
};

export default CoverImage;
