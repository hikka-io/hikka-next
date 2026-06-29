import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';
import { Link, useRouter } from '@/utils/navigation';

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center"
            >
                <span className="font-black text-[18rem] text-foreground/5 leading-none md:text-[24rem]">
                    404
                </span>
            </div>

            <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
                <div className="logo-full h-5 w-16" />

                <Image
                    src="/stickers/woah.webp"
                    width={224}
                    height={224}
                    background="transparent"
                    className="size-56"
                    alt="hikka face"
                />

                <div className="flex flex-col gap-2">
                    <p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
                        Помилка 404
                    </p>
                    <h1 className="font-bold text-3xl tracking-tight md:text-4xl">
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
