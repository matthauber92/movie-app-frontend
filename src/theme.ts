// src/theme.ts
import { alpha, createTheme, type ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        accent: Palette['primary'];
    }

    interface PaletteOptions {
        accent?: PaletteOptions['primary'];
    }
}

const commonOptions: ThemeOptions = {
    shape: { borderRadius: 14 },
    spacing: 8,
    typography: {
        fontFamily: [
            'Inter', 'SF Pro Text', 'system-ui', '-apple-system', 'Segoe UI',
            'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol'
        ].join(','),
        h1: { fontWeight: 800, letterSpacing: -0.5 },
        h2: { fontWeight: 700, letterSpacing: -0.25 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0.2 }
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 12, paddingInline: 18 },
                contained: { boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }
            }
        },
        MuiTextField: {
            defaultProps: { size: 'medium', variant: 'outlined' }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: { borderRadius: 12 },
                input: { paddingBlock: 12 }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    borderWidth: 1,
                    borderStyle: 'solid'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 10, fontWeight: 600 }
            }
        }
    }
};

export function getAppTheme(mode: 'light' | 'dark') {
    const isLight = mode === 'light';

    return createTheme({
        ...commonOptions,
        palette: {
            mode,
            // Muted Indigo (primary) + Muted Violet (secondary). Lower contrast, contemporary.
            primary: {
                light: '#7A86C4',   // muted indigo-300
                main: '#5865A6',   // muted indigo-500
                dark: '#7A86C4',   // muted indigo-700
                contrastText: '#F5F7FB'
            },
            secondary: {
                light: '#9A8FCE',   // muted violet-300
                main: '#7C6FBF',   // muted violet-500
                dark: '#5D54A0',   // muted violet-700
                contrastText: '#F5F7FB'
            },
            // Soft lavender accent for highlights/selection, not high-chroma
            accent: {
                light: '#B9AEE6',
                main: '#9E8CDA',
                dark: '#7E6FBE',
                contrastText: '#F5F7FB'
            },
            error: { main: '#E26B6B' }, // softened
            warning: { main: '#D9A446' },
            info: { main: '#6BA8D6' },
            success: { main: '#59B27A' },

            background: isLight
                ? { default: '#F6F7FA', paper: '#FFFFFF' }
                : { default: '#1E2430', paper: '#2A303D' }, // keep depth, but not pitch black

            text: isLight
                ? { primary: '#1B1F29', secondary: '#5B6475' }
                : { primary: '#FFFFFF', secondary: '#BFC6D4' }, // brighter text, softer secondary

            divider: isLight
                ? 'rgba(16, 22, 33, 0.08)'
                : 'rgba(255, 255, 255, 0.12)', // light border for separation


            // Slightly gentler hover/active opacities for a matte feel
            action: {
                hoverOpacity: 0.06,
                selectedOpacity: 0.10,
                disabledOpacity: 0.36,
                focusOpacity: 0.12,
                activatedOpacity: 0.10
            },
            grey: {
                50: '#F6F7FA',
                100: '#EFF1F5',
                200: '#E6E9EF',
                300: '#D6D9E0',
                400: '#B8BECA',
                500: '#9AA3B2',
                600: '#7D8696',
                700: '#61697A',
                800: '#424B5A',
                900: '#252C37'
            }
        },

        components: {
            ...commonOptions.components,

            MuiCssBaseline: {
                styleOverrides: ({ palette }) => ({
                    '::selection': {
                        background: palette.accent?.main,
                        color: palette.mode === 'light' ? '#fff' : '#0E1116'
                    },
                    body: {
                        // Subtle vignette only (no shiny gradients)
                        backgroundImage: isLight
                            ? 'radial-gradient(400px 200px at 10% -5%, rgba(88,101,166,0.05), transparent)'
                            : 'radial-gradient(600px 300px at 120% -20%, rgba(124,111,191,0.08), transparent)'
                    }
                })
            },
            MuiCard: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderColor: theme.palette.divider,
                        boxShadow: theme.shadows[2]
                    })
                }
            },

            // Buttons: remove heavy elevation, use gentle hover
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: 12,
                        paddingInline: 18,
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                            filter: 'brightness(0.98)',
                            backgroundColor:
                                theme.palette.mode === 'light'
                                    ? theme.palette.primary.dark + '1A' // tiny overlay
                                    : theme.palette.primary.light + '1A'
                        }
                    }),
                    outlined: ({ theme }) => ({
                        borderColor: theme.palette.divider
                    }),
                    containedSecondary: {
                        // make secondary (violet) the subtle “bright-dark” CTA
                        filter: 'saturate(0.95)'
                    }
                }
            },

            // Inputs: rounded, subtle focus ring using accent
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: 12,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.grey[300]
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.accent?.main,
                            boxShadow:
                                theme.palette.mode === 'light'
                                    ? '0 0 0 3px rgba(158,140,218,0.20)'
                                    : '0 0 0 3px rgba(158,140,218,0.28)'
                        }
                    }),
                    input: { paddingBlock: 12 }
                }
            },

            MuiChip: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: 10,
                        fontWeight: 600,
                        border: `1px solid ${theme.palette.divider}`
                    })
                }
            },

            MuiLink: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        fontWeight: 600,
                        textUnderlineOffset: 3,
                        color: theme.palette.primary.main,
                        '&:hover': { textDecorationThickness: '2px' }
                    })
                }
            },

            MuiDialog: {
                styleOverrides: {
                    paper: ({ theme }) => ({
                        borderRadius: 18,
                        border: `1px solid ${theme.palette.divider}`
                    })
                }
            },
            MuiAutocomplete: {
                styleOverrides: {
                    paper: {
                        marginTop: 8,
                        borderRadius: 12,
                        backgroundColor: '#0b0b0b',
                        backgroundImage: 'none',
                        boxShadow:
                            '0 12px 40px rgba(0,0,0,0.6)'
                    },

                    listbox: {
                        padding: 0
                    },

                    option: {
                        minHeight: 'unset',
                        padding: 0,

                        '&[aria-selected="true"]': {
                            backgroundColor: alpha('#fff', 0.08)
                        },

                        '&.Mui-focused': {
                            backgroundColor: alpha('#fff', 0.06)
                        }
                    },

                    noOptions: {
                        padding: '12px 16px',
                        color: alpha('#fff', 0.6)
                    },

                    loading: {
                        padding: '12px 16px'
                    }
                }
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none'
                    }
                }
            }
        }
    });
}
