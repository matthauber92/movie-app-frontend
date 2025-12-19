import { useEffect, useRef } from 'react';

export function useInfiniteScroll(
    onLoadMore: () => void,
    isLoading: boolean,
    hasMore: boolean
) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current || isLoading || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin: '300px' }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [onLoadMore, isLoading, hasMore]);

    return ref;
}
