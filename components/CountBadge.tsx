import React from 'react';

export const CountBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white">
            {count}
        </div>
    );
};
