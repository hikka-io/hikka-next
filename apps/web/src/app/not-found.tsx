import Link from 'next/link';

import H1 from '../components/typography/h1';
import P from '../components/typography/p';
import { Button } from '../components/ui/button';
import Image from '../components/ui/image';

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex grow flex-col items-center justify-center">
                <div className="flex flex-col gap-8 w-52">
                    <Image
                        unoptimized
                        src="/hikka.notfound.png"
                        width={200}
                        height={200}
                        className="size-full"
                        alt="hikka face"
                    />
                    <div className="flex flex-col h-52 justify-between">
                        <div>
                            <div className="w-full flex items-center justify-between">
                                <H1 className="text-[3rem]">404</H1>
                                <div className="logo-full w-[80px] h-[24px]" />
                            </div>
                            <P className="text-lg text-center">
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
