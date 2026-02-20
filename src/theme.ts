import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        htmlFontSize: 16,
        allVariants: {
            letterSpacing: '0.015em',
        },
        fontSize: 16,
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
    },

    palette: {
        primary: {
            main: '#0D6EFD',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        }
    },

    // 3. Forçamos a alta resolução e suavização diretamente no CssBaseline do MUI
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
                '*': {
                    boxSizing: 'border-box',
                },
            },
        },
    },
});

export default theme;