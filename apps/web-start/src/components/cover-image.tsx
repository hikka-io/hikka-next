'use client';

import { FC } from 'react';

import Image from '@/components/ui/image';

import { useSessionUI } from '@/services/hooks/use-session-ui';

interface Props {
    cover?: string | null;
    position?: 'top' | 'center' | 'bottom';
}

const CoverImage: FC<Props> = ({ cover, position = 'center' }) => {
    const { preferences } = useSessionUI();
    const overlay = preferences.overlay;
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
            data-overlay={overlay}
            className="gradient-mask-b-0 absolute top-0 left-0 -z-20 h-80 w-full overflow-hidden opacity-40"
        >
            <Image
                src={cover}
                layout="fullWidth"
                className={`relative size-full object-cover ${getPositionClass()}`}
                alt="cover"
                loading="lazy"
                unstyled
            />
        </div>
    );
};

export default CoverImage;
