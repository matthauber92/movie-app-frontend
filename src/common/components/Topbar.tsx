import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Autocomplete,
    TextField,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Slide,
    useMediaQuery
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '../../../hooks';
import { useSearchMoviesQuery } from '../../store/api/moviesApiSlice.ts';

/* ----------------------------- */
/* Types                         */
/* ----------------------------- */
type SearchResultType = 'movie' | 'tv' | 'person' | string;

type SearchResult = {
    id: number | string;
    type: SearchResultType;
    title: string;
    subtitle?: string | null;
    imagePath?: string | null;
};

const SearchWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: alpha('#fff', 0.08),
    transition: 'background-color 160ms ease, box-shadow 160ms ease',
    cursor: 'text',

    '&:hover': {
        backgroundColor: alpha('#fff', 0.12)
    },

    '&:focus-within': {
        backgroundColor: alpha('#fff', 0.16),
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`
    }
}));

const NavItem = ({ to, label }: { to: string; label: string }) => (
    <Typography
        component={NavLink}
        to={to}
        sx={{
            mx: 3,
            fontWeight: 800,
            fontSize: '1.1rem',
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.7)',
            position: 'relative',
            '&.active': { color: 'white' },
            '&.active::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -8,
                height: 3,
                borderRadius: 3,
                backgroundColor: 'white'
            }
        }}
    >
        {label}
    </Typography>
);

/* ----------------------------- */
/* TopBar                        */
/* ----------------------------- */
const TopBar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    /* ---- scroll state ---- */
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ---- search state ---- */
    const [searchInput, setSearchInput] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    /* ---- mobile nav ---- */
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchor);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const {
        data: rawSearchResults,
        isFetching: isSearching
    } = useSearchMoviesQuery(
        { query: debouncedSearch, page: 1 },
        { skip: debouncedSearch.trim().length < 2 }
    );

    const searchResults = useMemo<SearchResult[]>(
        () => (rawSearchResults ?? []) as SearchResult[],
        [rawSearchResults]
    );

    useEffect(() => {
        if (!searchOpen) return;
        const t = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(t);
    }, [searchOpen]);

    const SearchComponent = (
        <SearchWrapper onMouseDown={() => inputRef.current?.focus()}>
            <Autocomplete<SearchResult, false, false, false>
                options={searchResults}
                loading={isSearching}
                filterOptions={(x) => x}
                getOptionLabel={(option) => option.title ?? ''}
                popupIcon={null}
                fullWidth
                onChange={(_, value) => {
                    if (!value) return;
                    setSearchOpen(false);
                    navigate(`/${value.type === 'tv' ? 'series' : 'movies'}/${value.id}`);
                }}
                sx={{
                    '& .MuiAutocomplete-inputRoot': { px: 0 }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder="Search movies or TV…"
                        inputRef={inputRef}
                        onChange={(e) => setSearchInput(e.target.value)}
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            startAdornment: (
                                <>
                                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                                    {params.InputProps.startAdornment}
                                </>
                            ),
                            endAdornment: (
                                <>
                                    {isSearching && <CircularProgress size={16} sx={{ mr: 1 }} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                            sx: {
                                px: 2,
                                py: 1.5,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                '& input::placeholder': {
                                    color: 'rgba(255,255,255,0.6)'
                                }
                            }
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Box
                        component="li"
                        {...props}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            px: 2,
                            py: 0.75,
                            '&:hover, &.Mui-focused': {
                                backgroundColor: 'rgba(255,255,255,0.06)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 56,
                                borderRadius: 0.75,
                                overflow: 'hidden',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                flexShrink: 0
                            }}
                        >
                            {option.imagePath && (
                                <Box
                                    component="img"
                                    src={`https://image.tmdb.org/t/p/w92${option.imagePath}`}
                                    alt={option.title}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography noWrap fontSize={14} fontWeight={500}>
                                {option.title}
                            </Typography>
                            <Typography noWrap fontSize={12} color="rgba(255,255,255,0.6)">
                                {option.subtitle && `${option.subtitle} · `}
                                {option.type === 'tv' ? 'TV Series' : 'Movie'}
                            </Typography>
                        </Box>
                    </Box>
                )}
            />
        </SearchWrapper>
    );

    return (
        <>
            <AppBar
                elevation={0}
                position="fixed"
                sx={{
                    background: scrolled
                        ? 'rgba(0,0,0,0.92)'
                        : 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.65), rgba(0,0,0,0))',
                    backdropFilter: scrolled ? 'blur(10px)' : 'blur(6px)',
                    transition: 'background 200ms ease, backdrop-filter 200ms ease',
                    px: { xs: 2, md: 6 }
                }}
            >
                <Toolbar sx={{ minHeight: 72 }}>
                    {isMobile && (
                        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography fontWeight={900} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        H²Tv
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ ml: 6, display: 'flex' }}>
                            <NavItem to="/movies" label="Movies" />
                            <NavItem to="/series" label="Series" />
                        </Box>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton onClick={() => setSearchOpen(true)}>
                        <SearchIcon />
                    </IconButton>
                </Toolbar>

                <Slide direction="down" in={searchOpen} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            px: { xs: 2, md: 6 },
                            pb: 2,
                            backgroundColor: scrolled ? 'rgba(0,0,0,0.96)' : 'rgba(0,0,0,0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flexGrow: 1 }}>{SearchComponent}</Box>
                            <IconButton onClick={() => setSearchOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Slide>
            </AppBar>

            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{ sx: { backgroundColor: '#111', color: 'white' } }}
            >
                <MenuItem onClick={() => navigate('/movies')}>Movies</MenuItem>
                <MenuItem onClick={() => navigate('/series')}>Series</MenuItem>
            </Menu>

            <Outlet />
        </>
    );
};

export default TopBar;
