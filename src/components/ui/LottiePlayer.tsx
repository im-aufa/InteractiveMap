'use client';

import React from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';

interface LottiePlayerProps extends Omit<LottieComponentProps, 'animationData'> {
    animationData: any;
    className?: string;
}

const LottiePlayer: React.FC<LottiePlayerProps> = ({
    animationData,
    className,
    ...props
}) => {
    return (
        <div className={className}>
            <Lottie animationData={animationData} {...props} />
        </div>
    );
};

export default LottiePlayer;
