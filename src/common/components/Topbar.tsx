import {
    AppBar,
    Toolbar,
    Box,
    Typography
} from '@mui/material';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NavItem = ({ to, label }: { to: string; label: string }) => (
    <Typography
        component={NavLink}
        to={to}
        tabIndex={0}
        sx={{
            mx: 3,
            fontWeight: 800,
            fontSize: '1.1rem',
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.7)',
            position: 'relative',
            outline: 'none',
            transition: 'color 150ms ease, transform 150ms ease',

            '&.active': {
                color: 'white'
            },

            '&.active::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -8,
                height: 3,
                borderRadius: 3,
                backgroundColor: 'white'
            },

            '&:focus-visible': {
                color: 'white',
                transform: 'scale(1.08)',
                outline: '2px solid rgba(0,200,255,0.9)',
                outlineOffset: 6
            }
        }}
    >
        {label}
    </Typography>
);

const TopBar = () => {
    const navigate = useNavigate();

    return (
        <>
            <AppBar
                elevation={0}
                position="fixed"
                sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.65), rgba(0,0,0,0))',
                    backdropFilter: 'blur(6px)',
                    px: { xs: 3, md: 6 }
                }}
            >
                <Toolbar sx={{ minHeight: 72 }}>
                    {/* LOGO */}
                    <Typography
                        tabIndex={0}
                        fontWeight={900}
                        letterSpacing={1}
                        sx={{
                            cursor: 'pointer',
                            outline: 'none',
                            '&:focus-visible': {
                                outline: '2px solid rgba(0,200,255,0.9)',
                                outlineOffset: 6
                            }
                        }}
                        onClick={() => navigate('/')}
                    >
                        H²Tv
                    </Typography>

                    {/* NAV */}
                    <Box sx={{ ml: 6, display: 'flex' }}>
                        <NavItem to="/movies" label="Movies" />
                        <NavItem to="/series" label="Series" />
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>

            <Outlet />
        </>
    );
};

export default TopBar;
