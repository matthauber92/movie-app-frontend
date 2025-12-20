import {
    Box,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRef, useCallback, useEffect } from 'react';

const CARD_WIDTH = 260; // bigger for TV
const GAP = 24;
const SCROLL_AMOUNT = CARD_WIDTH + GAP;

type MediaCarouselProps = {
    title: string;
    onViewAll: () => void;
    isFetching?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    children: React.ReactNode;
};

const MediaCarousel = ({
                           title,
                           onViewAll,
                           isFetching,
                           hasMore,
                           onLoadMore,
                           children
                       }: MediaCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    /* ------------------------------------------------------------------
       SCROLL HELPERS
    ------------------------------------------------------------------ */
    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
            behavior: 'smooth'
        });
    };

    /* ------------------------------------------------------------------
       KEYBOARD / REMOTE HANDLING
    ------------------------------------------------------------------ */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                scroll('right');
                break;

            case 'ArrowLeft':
                e.preventDefault();
                scroll('left');
                break;

            case 'Enter':
                // Let focused card handle Enter
                break;

            default:
                break;
        }
    };

    /* ------------------------------------------------------------------
       PAGINATION (SCROLL-BASED + FOCUS SAFE)
    ------------------------------------------------------------------ */
    const handleScroll = useCallback(() => {
        if (!scrollRef.current || !hasMore || isFetching) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // Trigger pagination when near end
        if (scrollLeft + clientWidth >= scrollWidth - SCROLL_AMOUNT * 2) {
            onLoadMore?.();
        }
    }, [hasMore, isFetching, onLoadMore]);

    /* ------------------------------------------------------------------
       ENSURE ROW IS FOCUSABLE (TV ENTRY POINT)
    ------------------------------------------------------------------ */
    useEffect(() => {
        if (!scrollRef.current) return;

        // Ensure carousel can receive focus
        scrollRef.current.setAttribute('tabindex', '0');
    }, []);

    return (
        <Box sx={{ mb: 10 }}>
            {/* HEADER */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <Typography variant="h5" fontWeight={700}>
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        cursor: 'pointer',
                        opacity: 0.7,
                        '&:focus-visible': {
                            outline: 'none',
                            textDecoration: 'underline'
                        }
                    }}
                    tabIndex={0}
                    onClick={onViewAll}
                >
                    View all
                </Typography>
            </Stack>

            {/* CAROUSEL */}
            <Box sx={{ position: 'relative' }}>
                {/* LEFT ARROW */}
                <IconButton
                    onClick={() => scroll('left')}
                    tabIndex={-1} // do not steal focus on TV
                    sx={{
                        position: 'absolute',
                        top: '42%',
                        left: -32,
                        zIndex: 2,
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(0,0,0,0.55)'
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                {/* SCROLL CONTAINER */}
                <Box
                    ref={scrollRef}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        pb: 2,
                        px: 1,
                        outline: 'none',

                        '&:focus-visible': {
                            outline: '2px solid rgba(0,200,255,0.7)',
                            outlineOffset: 4
                        },

                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }}
                >
                    {children}
                </Box>

                {/* RIGHT ARROW */}
                <IconButton
                    onClick={() => scroll('right')}
                    tabIndex={-1}
                    sx={{
                        position: 'absolute',
                        top: '42%',
                        right: -32,
                        zIndex: 2,
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(0,0,0,0.55)'
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MediaCarousel;
