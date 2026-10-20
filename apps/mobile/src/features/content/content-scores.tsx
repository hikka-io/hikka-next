import type { FC, ReactNode } from 'react';

import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import { formatCompactNumber } from '@hikka/core';

import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import type { ContentInfo } from './queries';
import { HikkaLogo, MALLogo } from './score-logos';

type ScoreProps = {
    logo: ReactNode;
    label: string;
    score: number;
    scoredBy: number;
    fill: boolean;
};

const Score: FC<ScoreProps> = ({ logo, label, score, scoredBy, fill }) => {
    const { color: starColor } = useResolveClassNames('text-yellow-400');

    return (
        <View
            accessible
            accessibilityLabel={`${label}: ${score}, ${formatCompactNumber(scoredBy)} оцінок`}
            className={cn(
                'flex-row items-center justify-center gap-4',
                fill && 'flex-1',
            )}
        >
            {logo}
            <View className="items-start">
                <View className="flex-row items-center gap-1">
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="font-bold text-base tabular-nums"
                    >
                        {score}
                    </Text>
                    <Icon
                        as={Star}
                        fill={
                            typeof starColor === 'string'
                                ? starColor
                                : undefined
                        }
                        className="size-4 text-yellow-400"
                    />
                </View>
                <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="text-muted-foreground text-xs tracking-wider"
                >
                    {formatCompactNumber(scoredBy)} оцінок
                </Text>
            </View>
        </View>
    );
};

type Props = {
    content: ContentInfo;
};

const ContentScores: FC<Props> = ({ content }) => {
    const { score, scored_by, native_score, native_scored_by } = content;
    const both = !!score && !!native_score;

    if (score === 0 && native_score === 0) {
        return null;
    }

    return (
        <View
            className={cn(
                'flex-row items-center gap-4 rounded-md border border-border bg-surface p-2 px-4',
                !both && 'self-start',
            )}
        >
            {!!score && (
                <Score
                    logo={<MALLogo />}
                    label="MyAnimeList"
                    score={score}
                    scoredBy={scored_by}
                    fill={both}
                />
            )}
            {both && <Separator orientation="vertical" className="h-8" />}
            {!!native_score && (
                <Score
                    logo={<HikkaLogo />}
                    label="Hikka"
                    score={native_score}
                    scoredBy={native_scored_by}
                    fill={both}
                />
            )}
        </View>
    );
};

export default ContentScores;
