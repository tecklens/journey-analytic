import {animated, useSpring} from "@react-spring/web";
import {nFormatter} from "@admin/lib/utils.ts";

const AnimatedNumber = ({ value }: {value: number}) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: value,
        config: { duration: 1000 },
    });

    return <animated.span>{number.to((n) => nFormatter(Math.round(n), 2))}</animated.span>;
};

export default AnimatedNumber;
