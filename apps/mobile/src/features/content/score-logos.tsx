import { type FC, useId } from 'react';

import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useResolveClassNames } from 'uniwind';

type Props = {
    size?: number;
};

const MAL_PATH =
    'M8.273 7.247v8.423l-2.103-.003v-5.216l-2.03 2.404l-1.989-2.458l-.02 5.285H.001L0 7.247h2.203l1.865 2.545l2.015-2.546l2.19.001zm8.628 2.069l.025 6.335h-2.365l-.008-2.871h-2.8c.07.499.21 1.266.417 1.779c.155.381.298.751.583 1.128l-1.705 1.125c-.349-.636-.622-1.337-.878-2.082a9.296 9.296 0 0 1-.507-2.179c-.085-.75-.097-1.471.107-2.212a3.908 3.908 0 0 1 1.161-1.866c.313-.293.749-.5 1.1-.687c.351-.187.743-.264 1.107-.359a7.405 7.405 0 0 1 1.191-.183c.398-.034 1.107-.066 2.39-.028l.545 1.749H14.51c-.593.008-.878.001-1.341.209a2.236 2.236 0 0 0-1.278 1.92l2.663.033l.038-1.81h2.309zm3.992-2.099v6.627l3.107.032l-.43 1.775h-4.807V7.187l2.13.03z';

const HIKKA_PATH =
    'M4.4708 0.70609L0.589628 4.59687C-0.191756 5.38018 -0.188691 6.64908 0.596468 7.42862L4.96139 11.7623C5.73868 12.534 5.75062 13.7874 4.98817 14.5738L0.564427 19.1364C-0.203837 19.9288 -0.185014 21.1937 0.606488 21.9629L4.54029 25.7857C5.32242 26.5457 6.56929 26.5391 7.34324 25.7707L11.7233 21.422C12.5059 20.645 13.7696 20.6481 14.5484 21.4288L18.8515 25.7426C19.6301 26.5231 20.8936 26.5264 21.6762 25.7498L25.5983 21.8581C26.3892 21.0733 26.3863 19.7936 25.5919 19.0124L21.2261 14.7192C20.4293 13.9356 20.4292 12.6511 21.2259 11.8674L25.7309 7.43566C26.525 6.65446 26.5278 5.37502 25.7372 4.59034L21.6967 0.580353C20.9061 -0.204231 19.6269 -0.191836 18.8517 0.607918L14.5481 5.04784C13.7728 5.84773 12.4933 5.85997 11.7028 5.07507L7.29595 0.69933C6.51341 -0.0776696 5.24961 -0.0746451 4.4708 0.70609Z';

export const MALLogo: FC<Props> = ({ size = 16 }) => {
    const { color } = useResolveClassNames('text-foreground');

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                fill={typeof color === 'string' ? color : undefined}
                d={MAL_PATH}
            />
        </Svg>
    );
};

// The gradient stops are the brand logo's own colors (web HikkaLogoGradient), not theme tokens.
export const HikkaLogo: FC<Props> = ({ size = 16 }) => {
    const gradientId = useId();

    return (
        <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
            <Path d={HIKKA_PATH} fill={`url(#${gradientId})`} />
            <Defs>
                <LinearGradient
                    id={gradientId}
                    x1="1.57597"
                    y1="2.24081"
                    x2="27.2166"
                    y2="20.5843"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0.290756" stopColor="#D691F7" />
                    <Stop offset="1" stopColor="#226CBB" />
                </LinearGradient>
            </Defs>
        </Svg>
    );
};
