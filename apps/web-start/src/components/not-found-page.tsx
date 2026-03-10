import { Link } from '@/utils/navigation';

import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex grow flex-col items-center justify-center">
                <div className="flex w-52 flex-col gap-8">
                    <Image
                        src="/hikka.notfound.png"
                        width={200}
                        height={200}
                        className="size-full"
                        alt="hikka face"
                    />
                    <div className="flex h-52 flex-col justify-between">
                        <div>
                            <div className="flex w-full items-center justify-between">
                                <h1 className="text-[3rem]">404</h1>
                                <div className="logo-full h-[24px] w-[80px]" />
                            </div>
                            <p className="text-center text-lg">
                                На жаль, такої сторінки не існує 😢
                            </p>
                        </div>
                        <Button className="w-full" variant="outline" asChild>
                            <Link to="/">На головну</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
