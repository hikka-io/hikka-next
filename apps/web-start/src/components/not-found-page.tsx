import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

import { Link, useRouter } from '@/utils/navigation';

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center select-none"
            >
                <span className="text-foreground/5 text-[18rem] leading-none font-black md:text-[24rem]">
                    404
                </span>
            </div>

            <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
                <div className="logo-full h-5 w-16" />

                <Image
                    src="/hikka.notfound.png"
                    width={224}
                    height={224}
                    background="transparent"
                    className="size-56"
                    alt="hikka face"
                />

                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                        Помилка 404
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Сторінку не знайдено
                    </h1>
                    <p className="text-muted-foreground">
                        На жаль, сторінка, яку ви шукаєте, не існує або була
                        переміщена.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-4 sm:flex-row">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Назад
                    </Button>
                    <Button className="flex-1" asChild>
                        <Link to="/">На головну</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
