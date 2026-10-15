import type { SVGProps } from 'react';

export function CustomUserLinkZenko(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M3 3l6 5q3-.7 6 0l6-5-1 9q-1 5-8 10-7-5-8-10ZM6.500 11.500l3.800 1.700-.7 1.200ZM17.500 11.500l-3.800 1.700.7 1.200Z"
            />
        </svg>
    );
}
export default CustomUserLinkZenko;
