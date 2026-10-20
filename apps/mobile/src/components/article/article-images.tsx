import type { FC } from 'react';

import { useRecyclingState } from '@shopify/flash-list';
import { Pressable, View } from 'react-native';

import { openImageViewer } from '@/components/image-viewer';
import Image from '@/components/ui/image';
import { sizedImageUrl } from '@/utils/image-presets';

import { imageGridLayout } from './document-layout';

// The widest phone screen, in points: images are sized for it, like markdown images.
const MAX_WIDTH = 440;
const FALLBACK_RATIO = 16 / 9;
const GAP = 4;

type Props = {
    urls: string[];
};

// The grid reorders a group of four by column, so each tile looks up its own position in the group.
const positionsByColumn = (urls: string[], columns: { urls: string[] }[]) => {
    const taken = new Set<number>();

    return columns.map((column) =>
        column.urls.map((url) => {
            const position = urls.findIndex(
                (candidate, index) => candidate === url && !taken.has(index),
            );
            taken.add(position);
            return position;
        }),
    );
};

const ArticleImages: FC<Props> = ({ urls }) => {
    const layout = imageGridLayout(urls);
    const [measured, setMeasured] = useRecyclingState<number | null>(null, [
        urls[0],
    ]);
    const positions = positionsByColumn(urls, layout.columns);
    const single = layout.aspectRatio === null;
    const totalFlex = layout.columns.reduce((sum, { flex }) => sum + flex, 0);

    return (
        <View
            accessibilityRole="image"
            accessibilityLabel={
                urls.length > 1 ? `Зображення: ${urls.length}` : 'Зображення'
            }
            style={{
                aspectRatio: layout.aspectRatio ?? measured ?? FALLBACK_RATIO,
                gap: GAP,
            }}
            className="flex-row overflow-hidden rounded-md border border-border bg-muted"
        >
            {layout.columns.map((column, columnIndex) => (
                <View key={columnIndex} style={{ flex: column.flex, gap: GAP }}>
                    {column.urls.map((url, index) => (
                        <Pressable
                            // One group may repeat a url, so the position is part of the key.
                            key={`${index}:${url}`}
                            accessibilityRole="imagebutton"
                            accessibilityLabel="Переглянути зображення"
                            onPress={() =>
                                openImageViewer(
                                    urls,
                                    positions[columnIndex][index],
                                )
                            }
                            className="flex-1"
                        >
                            <Image
                                source={sizedImageUrl(
                                    url,
                                    (MAX_WIDTH * column.flex) / totalFlex,
                                )}
                                recyclingKey={url}
                                contentFit="cover"
                                transition={150}
                                accessibilityIgnoresInvertColors
                                className="size-full bg-muted"
                                onLoad={
                                    single
                                        ? ({ source }) => {
                                              if (
                                                  source.width > 0 &&
                                                  source.height > 0
                                              ) {
                                                  setMeasured(
                                                      source.width /
                                                          source.height,
                                                  );
                                              }
                                          }
                                        : undefined
                                }
                            />
                        </Pressable>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default ArticleImages;
