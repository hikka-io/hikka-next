import P from '@/components/typography/p';

interface Props {
    watchList: Record<string, any>[];
}

const Component = ({ watchList }: Props) => {
    return (
        <div>
            <P>
                У вашому списку знайдено{' '}
                <span className="rounded-sm bg-primary px-1 text-primary-foreground">
                    {watchList.length}
                </span>{' '}
                аніме, що готові до імпорту
            </P>
        </div>
    );
};

export default Component;
