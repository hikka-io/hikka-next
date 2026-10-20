import type { FC } from 'react';

import { useRouter } from 'expo-router';
import { MessageCirclePlus, Popcorn } from 'lucide-react-native';
import { View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import { findMovieBanner } from '@hikka/core';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { composerHref } from '@/features/comments';
import { sizedImageUrl } from '@/utils/image-presets';

import type { ContentInfo } from './queries';

const BANNER_BLUR = 12;
// Banners span the content column of the widest phone.
const BANNER_WIDTH = 440;

type Props = {
    content: ContentInfo;
};

/** The web's anime `ContentMovieBanner`: a timed call to discuss a movie, from the banner list shared through `@hikka/core`. */
const ContentMovieBanner: FC<Props> = ({ content }) => {
    const router = useRouter();
    const { hasToken } = useSession();

    if (content.data_type !== ContentTypeEnum.ANIME) return null;

    const banner = findMovieBanner(content.slug, Math.floor(Date.now() / 1000));
    if (!banner) return null;

    const image = banner.image ?? content.image;

    const writeComment = () =>
        router.push(
            hasToken
                ? composerHref({
                      contentType: ContentTypeEnum.ANIME,
                      slug: content.slug,
                  })
                : '/login',
        );

    return (
        <Card variant="plain" className="overflow-hidden">
            {image && (
                <Image
                    source={sizedImageUrl(image, BANNER_WIDTH)}
                    contentFit="cover"
                    blurRadius={BANNER_BLUR}
                    accessible={false}
                    accessibilityIgnoresInvertColors
                    className="absolute inset-0 size-full"
                />
            )}
            <View className="absolute inset-0 bg-black/40" />
            <View className="flex-row items-center gap-4">
                <Icon as={Popcorn} className="size-6 text-white" />
                <View className="flex-1 gap-1">
                    <Text
                        accessibilityRole="header"
                        className="font-bold text-lg text-white leading-5"
                    >
                        {banner.title}
                    </Text>
                    <Text className="font-medium text-sm text-white/80">
                        {banner.description}
                    </Text>
                </View>
            </View>
            <Button
                containerClassName="self-stretch"
                className="w-full"
                onPress={writeComment}
            >
                <Icon as={MessageCirclePlus} />
                Написати коментар
            </Button>
        </Card>
    );
};

export default ContentMovieBanner;
