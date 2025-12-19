import {
    AppBar,
    Toolbar,
    Box,
    Typography
} from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';

const NavItem = ({ to, label }: { to: string; label: string }) => (
    <Typography
        component={NavLink}
        to={to}
        sx={{
            mx: 1.5,
            fontWeight: 700,
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.7)',
            position: 'relative',
            '&.active': {
                color: 'white'
            },
            '&.active::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -6,
                height: 2,
                borderRadius: 2,
                backgroundColor: 'white'
            }
        }}
    >
        {label}
    </Typography>
);

const TopBar = () => {
    return (
        <>
            <AppBar
                elevation={0}
                position="fixed"
                sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.65), rgba(0,0,0,0))',
                    backdropFilter: 'blur(6px)',
                    px: { xs: 2, md: 4 },
                    borderBottom: 0
                }}
            >
                <Toolbar>
                    {/* Logo */}
                    <Typography fontWeight={900} letterSpacing={1}>
                        H²Tv
                    </Typography>

                    <Box sx={{ ml: 4, display: 'flex' }}>
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
