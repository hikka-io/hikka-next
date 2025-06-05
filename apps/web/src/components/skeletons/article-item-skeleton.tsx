import Card from '../ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '../ui/horizontal-card';

interface Props {}

const ArticleItemSkeleton = ({}: Props) => {
    return (
        <Card className="-mx-4 animate-pulse overflow-hidden md:mx-0">
            <HorizontalCard href="#">
                <HorizontalCardImage
                    imageClassName="bg-secondary/20"
                    image={<div />}
                    imageRatio={1}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle>
                        <div className="h-4 w-24 rounded-lg bg-secondary/20" />
                    </HorizontalCardTitle>
                    <HorizontalCardContainer className="flex-row items-center">
                        <HorizontalCardDescription>
                            <div className="h-2 w-10 rounded-lg bg-secondary/20" />
                        </HorizontalCardDescription>
                        <div className="size-1 rounded-full bg-secondary/20" />
                        <HorizontalCardDescription>
                            <div className="h-2 w-16 rounded-lg bg-secondary/20" />
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
                <div className="h-10 w-20 rounded-lg bg-secondary/20" />
            </HorizontalCard>
            <div className="relative flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <div className="h-2 w-24 rounded-lg bg-secondary/20" />
                    <div className="h-6 w-full rounded-lg bg-secondary/20" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-full rounded-lg bg-secondary/20" />
                    <div className="h-2 w-1/3 rounded-lg bg-secondary/20" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-secondary/20" />
                    <div className="h-5 w-12 rounded-full bg-secondary/20" />
                </div>
                <div className="flex gap-1">
                    <div className="h-8 w-12 rounded-lg bg-secondary/20" />
                    <div className="h-8 w-12 rounded-lg bg-secondary/20" />
                </div>
            </div>
        </Card>
    );

    return (
        <div className="flex animate-pulse flex-col gap-2">
            <div className="relative w-full overflow-hidden rounded-lg bg-inherit pt-[140%]">
                <div className="absolute left-0 top-0 size-full bg-secondary/20" />
            </div>
            <div className="flex flex-col gap-2 py-3">
                <div className="h-2 w-full rounded-lg bg-secondary/20" />
                <div className="h-2 w-1/3 rounded-lg bg-secondary/20" />
            </div>
        </div>
    );
};

export default ArticleItemSkeleton;
