import {TTypoProps} from "./type";

const typoH4 = ({children, className, ...props}: TTypoProps) => {
    return (
        <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`} {...props}>
            {children}
        </h4>
    );
};

export default typoH4;
