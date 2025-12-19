import {
    AppBar,
    Toolbar,
    Box,
    Autocomplete,
    TextField,
    CircularProgress,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDebouncedValue } from '../../../../hooks';
import { useSearchMoviesQuery } from '../../../store/api/moviesApiSlice.ts';
import type { SearchResultDto } from '../../../store/interfaces/Movie.ts';

const TopBar = () => {
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const debounced = useDebouncedValue(inputValue, 350);

    const { data, isFetching } = useSearchMoviesQuery(
        { query: debounced, page: 1 },
        { skip: debounced.trim().length < 2 }
    );

    return (
        <AppBar
            // position="sticky"
            // elevation={4}
            // sx={{
            //     backdropFilter: 'blur(10px)',
            //     backgroundColor: alpha(theme.palette.background.paper, 0.85),
            //     borderBottom: `1px solid ${theme.palette.divider}`
            // }}
        >
            <Toolbar sx={{ gap: 2 }}>
                {/* Logo / Brand */}
                <Typography fontWeight={800} letterSpacing={0.5}>
                    MOVIES
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Autocomplete Search */}
                <Autocomplete<SearchResultDto, false, false, false>
                    sx={{ width: 360 }}
                    options={data ?? []}
                    loading={isFetching}
                    filterOptions={(x) => x} // disable client filtering
                    getOptionLabel={(option) => option.title}
                    onChange={(_, value) => {
                        if (!value) return;

                        if (value.type === 'movie') {
                            navigate(`/movies/${value.id}`);
                        }

                        if (value.type === 'tv') {
                            navigate(`/tv/${value.id}`);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search movies or TV…"
                            onChange={(e) => setInputValue(e.target.value)}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <SearchIcon sx={{ mr: 1 }} />
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                                endAdornment: (
                                    <>
                                        {isFetching && (
                                            <CircularProgress
                                                size={18}
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                        {params.InputProps.endAdornment}
                                    </>
                                )
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
                                gap: 1
                            }}
                        >
                            {option.imagePath && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${option.imagePath}`}
                                    alt={option.title}
                                    width={40}
                                    height={60}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: 6
                                    }}
                                />
                            )}

                            <Box>
                                <Typography fontWeight={600}>
                                    {option.title}
                                </Typography>
                                {option.subtitle && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {option.subtitle}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                />
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
