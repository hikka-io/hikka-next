import type { SVGProps } from 'react';

export function CustomUserLinkAnitube(props: SVGProps<SVGSVGElement>) {
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
                d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4ZM7 17 10.8 7h2.4L17 17h-2.3l-.7-2h-4l-.7 2ZM10.7 13l1.3-3.4 1.3 3.4Z"
            />
        </svg>
    );
}
export default CustomUserLinkAnitube;
