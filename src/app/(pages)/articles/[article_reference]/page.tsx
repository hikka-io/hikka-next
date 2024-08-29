import { FC } from 'react';
import MdiDotsHorizontal from '~icons/mdi/dots-horizontal';

import H3 from '@/components/typography/h3';
import P from '@/components/typography/p';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Props {}

const ArticlePage: FC<Props> = () => {
    return (
        <div className="container flex max-w-3xl flex-col gap-12 p-0">
            <Card className="gap-0 overflow-hidden p-0">
                <div className="flex items-center justify-between gap-2 p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-12 rounded-md">
                            <AvatarFallback className="rounded-md">
                                T
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <Label>MatthewBishop</Label>
                            <P className="text-xs text-muted-foreground">
                                2 дні тому
                            </P>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="md" variant="outline">
                            Відстежується
                        </Button>
                        <Button size="icon-md" variant="outline">
                            <MdiDotsHorizontal className="size-4" />
                        </Button>
                    </div>
                </div>
                <Separator />
                <Image
                    src="https://i.pinimg.com/originals/8a/1c/20/8a1c20db423f85de20c1269b348713b3.jpg"
                    alt={'article cover'}
                    width={1260}
                    height={283}
                    className="h-52 w-full object-cover"
                />
            </Card>
            <Block>
                <Header variant="h2" title="Не зупиняйся: огляд Брами Штейна" />
                <P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    et massa mi. Aliquam in hendrerit urna. Pellentesque sit
                    amet sapien fringilla, mattis ligula consectetur, ultrices
                    mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet
                    augue. Vestibulum auctor ornare leo, non suscipit magna
                    interdum eu. Curabitur pellentesque nibh nibh, at maximus
                    ante fermentum sit amet. Pellentesque commodo lacus at
                    sodales sodales. Quisque sagittis orci ut diam condimentum,
                    vel euismod erat placerat. In iaculis arcu eros, eget tempus
                    orci facilisis id.
                </P>
                <H3>Початок історії</H3>
                <P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    et massa mi. Aliquam in hendrerit urna. Pellentesque sit
                    amet sapien fringilla, mattis ligula consectetur, ultrices
                    mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet
                    augue. Vestibulum auctor ornare leo, non suscipit magna
                    interdum eu. Curabitur pellentesque nibh nibh, at maximus
                    ante fermentum sit amet. Pellentesque commodo lacus at
                    sodales sodales. Quisque sagittis orci ut diam condimentum,
                    vel euismod erat placerat. In iaculis arcu eros, eget tempus
                    orci facilisis id.
                </P>
                <P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    et massa mi. Aliquam in hendrerit urna. Pellentesque sit
                    amet sapien fringilla, mattis ligula consectetur, ultrices
                    mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet
                    augue. Vestibulum auctor ornare leo, non suscipit magna
                    interdum eu. Curabitur pellentesque nibh nibh, at maximus
                    ante fermentum sit amet. Pellentesque commodo lacus at
                    sodales sodales. Quisque sagittis orci ut diam condimentum,
                    vel euismod erat placerat. In iaculis arcu eros, eget tempus
                    orci facilisis id.
                </P>
            </Block>
        </div>
    );
};

export default ArticlePage;
