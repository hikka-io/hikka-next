import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {}

const ArticleItemSkeleton = ({}: Props) => {
    return (
        <Card className="-mx-4 animate-pulse overflow-hidden md:mx-0">
            <HorizontalCard>
                <HorizontalCardImage
                    imageClassName="bg-secondary/20"
                    image={<div />}
                    imageRatio={1}
                    href="#"
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle href="#">
                        <div className="bg-secondary/20 h-4 w-24 rounded-lg" />
                    </HorizontalCardTitle>
                    <HorizontalCardContainer className="flex-row items-center">
                        <HorizontalCardDescription>
                            <div className="bg-secondary/20 h-2 w-10 rounded-lg" />
                        </HorizontalCardDescription>
                        <div className="bg-secondary/20 size-1 rounded-full" />
                        <HorizontalCardDescription>
                            <div className="bg-secondary/20 h-2 w-16 rounded-lg" />
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
                <div className="bg-secondary/20 h-10 w-20 rounded-lg" />
            </HorizontalCard>
            <div className="relative flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <div className="bg-secondary/20 h-2 w-24 rounded-lg" />
                    <div className="bg-secondary/20 h-6 w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="bg-secondary/20 h-2 w-full rounded-lg" />
                    <div className="bg-secondary/20 h-2 w-full rounded-lg" />
                    <div className="bg-secondary/20 h-2 w-1/3 rounded-lg" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="bg-secondary/20 h-5 w-16 rounded-full" />
                    <div className="bg-secondary/20 h-5 w-12 rounded-full" />
                </div>
                <div className="flex gap-1">
                    <div className="bg-secondary/20 h-8 w-12 rounded-lg" />
                    <div className="bg-secondary/20 h-8 w-12 rounded-lg" />
                </div>
            </div>
        </Card>
    );

    return (
        <div className="flex animate-pulse flex-col gap-2">
            <div className="relative w-full overflow-hidden rounded-lg bg-inherit pt-[140%]">
                <div className="bg-secondary/20 absolute top-0 left-0 size-full" />
            </div>
            <div className="flex flex-col gap-2 py-3">
                <div className="bg-secondary/20 h-2 w-full rounded-lg" />
                <div className="bg-secondary/20 h-2 w-1/3 rounded-lg" />
            </div>
        </div>
    );
};

export default ArticleItemSkeleton;
