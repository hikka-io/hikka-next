import Link from 'next/link';

import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

import H1 from '../components/typography/h1';
import P from '../components/typography/p';

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex grow flex-col items-center justify-center">
                <div className="flex w-52 flex-col gap-8">
                    <Image
                        unoptimized
                        src="/hikka.notfound.png"
                        width={200}
                        height={200}
                        className="size-full"
                        alt="hikka face"
                    />
                    <div className="flex h-52 flex-col justify-between">
                        <div>
                            <div className="flex w-full items-center justify-between">
                                <H1 className="text-[3rem]">404</H1>
                                <div className="logo-full h-[24px] w-[80px]" />
                            </div>
                            <P className="text-center text-lg">
                                На жаль, такої сторінки не існує 😢
                            </P>
                        </div>
                        <Button className="w-full" variant="outline" asChild>
                            <Link href="/">На головну</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
