import {
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import {
    Box,
    Button,
    Container as MuiContainer,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import  { useRef } from "react";

import LoadingIndicator, { type LoadingIndicatorRef } from "../../components/loading-indicator/Component";

import { useIsMobile } from "@/hooks/useIsMobile";

import { APP_THEME } from "@/styles/themeConstants";

import {useLogin} from "@/hooks/useLogin";

const BG_IMAGE_URL = "https://assets.datagro.com/wp-content/uploads/2020/06/Industria_cana.jpg";

export const Login = () => {

    const theme = APP_THEME['default'];
    const isMobile = useIsMobile();
    const loaderRef = useRef<LoadingIndicatorRef>(null);
    const {
        handleClickShowPassword,
        handleMouseDownPassword,
        handleLoginChange,
        handleKeyDown,
        submitLogin,
        NotificationModal,
        login,
        password,
        showPassword
    } = useLogin( loaderRef,isMobile)


    return (
        <Box sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100%",
            overflow: "hidden",
            backgroundImage: `url(${BG_IMAGE_URL})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            "&::before": {
                content: '""',
                position: "absolute",
                height: "100%",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(2px)",
                zIndex: -1
            }
        }}>
            <LoadingIndicator ref={loaderRef} />
            {NotificationModal}

            <MuiContainer
                maxWidth="sm"
                disableGutters={isMobile}
                sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    pb: 0,
                    zIndex: 1,
                }}
            >
                <Paper
                    elevation={isMobile ? 0 : 8}
                    sx={{
                        position: "relative",

                        padding: isMobile ? 3 : 6,
                        borderRadius: isMobile ? 0 : 4,

                        backgroundColor: "rgba(255,255,255, 0.1)",
                        backdropFilter: "blur(16px)",
                        border: "none",

                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',

                        height: 'auto',


                        maxHeight: '100%',

                        transition: "all 0.3s ease"
                    }}
                >

                    {/* LOGO */}
                    <Box sx={{ mb: 5, textAlign: 'center', width: '100%' }}>
                        <img
                            src="https://github.com/Erikvilar/agrion-frontend/blob/develop/src/assets/logo/logoAgrion.jpg?raw=true"
                            alt="Agrion Logo"
                            style={{
                                maxWidth: isMobile ? '180px' : '280px',
                                width: '100%',
                                height: 'auto',
                                marginBottom: '16px',
                                borderRadius: "8px",
                                mixBlendMode: "multiply",
                                filter: "brightness(1.2) saturate(1.5) contrast(1.1)"
                            }}
                        />
                        <Typography variant="body2" sx={{ color: "white" }}>
                            Faça login para acessar o painel
                        </Typography>
                    </Box>

                    {/* INPUTS E BOTÃO */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Usuário"
                            name="login"
                            value={login}
                            onChange={handleLoginChange}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            autoComplete="username"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    height: 56,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "white",
                                    transition: "all 0.2s",
                                    "& fieldset": { borderColor: "white" },
                                    "&:hover fieldset": { borderColor: "white" },
                                    "&.Mui-focused fieldset": {
                                        borderColor: theme.border.focus,
                                        borderWidth: 2,
                                        backgroundColor:"transparent"
                                    },
                                },
                                "& input::placeholder": {
                                    color: "white",
                                    opacity: 1
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: theme.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            placeholder="Senha"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleLoginChange}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            autoComplete="current-password"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    height: 56,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "white",
                                    transition: "all 0.2s",
                                    "& fieldset": { borderColor: "white" },
                                    "&:hover fieldset": { borderColor: "white" },
                                    "&.Mui-focused fieldset": {
                                        borderColor: theme.border.focus,
                                        borderWidth: 2
                                    },
                                },
                                "& input::placeholder": {
                                    color: "white",
                                    opacity: 1
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: theme.text.secondary }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{ color: theme.text.secondary }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={submitLogin}
                            fullWidth
                            size="large"
                            sx={{
                                mt: 1,
                                height: 56,
                                borderRadius: 2,
                                backgroundColor: "#48b301",
                                color: "#FFFFFF",
                                fontWeight: "800",
                                fontSize: "1rem",
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                boxShadow: "0 4px 14px 0 rgba(0,0,0,0.15)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: theme.border.focus,
                                    filter: "brightness(0.9)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                                },
                            }}
                        >
                            ACESSAR SISTEMA
                        </Button>
                    </Box>

                    {/* FOOTER */}
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="caption" sx={{ color: "white", fontWeight: 500 }} align="center" display="block">
                            © {new Date().getFullYear()} Agrion. Sistema de Controle.
                        </Typography>
                    </Box>

                </Paper>
            </MuiContainer>

        </Box>
    );
};