import type { SVGProps } from 'react';

export function CustomUserLinkMangaInUa(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="#1a9cee"
                d="M5 2h14a2 2 0 0 1 2 2v14.500H3V4a2 2 0 0 1 2-2Z"
            />
            <path
                fill="#1a9cee"
                d="M3 19.500h18V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                opacity=".6"
            />
            <path
                fill="#fff"
                d="M6.500 14.500v-8h2.200l3.300 4.400 3.300-4.400h2.200v8h-2.200V10l-3.300 4.200L8.700 10v4.500Z"
            />
        </svg>
    );
}
export default CustomUserLinkMangaInUa;
