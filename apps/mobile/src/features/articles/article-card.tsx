import type { FC } from 'react';

import { Link, useRouter } from 'expo-router';
import { ArrowBigUp, Eye, MessageCircle } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { ArticlePreviewResponse } from '@hikka/api';

import { ArticleDocument } from '@/components/article';
import Card from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';

import ArticleAuthor from './article-author';
import ArticleContentChip from './article-content-chip';
import ArticleTags from './article-tags';

const PREVIEW_TAGS = 2;

type Props = {
    article: ArticlePreviewResponse;
};

/** The web's `ArticleItem`: author, content chip, title, two tags, the backend's preview of the document and stats. */
const ArticleCard: FC<Props> = ({ article }) => {
    const router = useRouter();

    return (
        <Card className="gap-4">
            <ArticleAuthor article={article} />
            {article.content && (
                <ArticleContentChip content={article.content} />
            )}
            <Link href={`/articles/${article.slug}`} asChild>
                <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={article.title}
                    className="gap-4 active:opacity-70"
                >
                    <Text className="font-bold text-lg leading-7">
                        {article.title}
                    </Text>
                    <ArticleTags tags={article.tags} limit={PREVIEW_TAGS} />
                    <ArticleDocument
                        key={article.slug}
                        document={article.preview}
                        interactive={false}
                    />
                </Pressable>
            </Link>
            <View className="flex-row items-center">
                <StatItemGroup>
                    {article.views > 0 && (
                        <StatItem
                            accessibilityLabel={`Перегляди: ${article.views}`}
                        >
                            <Icon as={Eye} />
                            {article.views}
                        </StatItem>
                    )}
                    <StatItem
                        accessibilityLabel={`Коментарі: ${article.comments_count}`}
                        onPress={() =>
                            router.push(`/comments/article/${article.slug}`)
                        }
                    >
                        <Icon as={MessageCircle} />
                        {article.comments_count}
                    </StatItem>
                    <StatItem
                        accessibilityLabel={`Рейтинг: ${article.vote_score}`}
                    >
                        <Icon as={ArrowBigUp} className="size-5" />
                        {article.vote_score}
                    </StatItem>
                </StatItemGroup>
            </View>
        </Card>
    );
};

export default ArticleCard;
