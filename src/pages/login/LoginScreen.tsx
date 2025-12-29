import {
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Container as MuiContainer,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingIndicator, { type LoadingIndicatorRef } from "../../components/loading-indicator/Component";
import { ActionType } from "../../components/modal-informativo/Component";
import { useNotification } from "../../hooks/useNotification";
import type UserDTO from "../../model/UserDTO";
import ApiServices from "../../services/api-service";

// --- Configuração da Imagem de Fundo ---
// Imagem de agricultura (Campo/Soja/Trator) do Unsplash
const BG_IMAGE_URL = "https://rehagro.com.br/blog/wp-content/uploads/2025/04/capa-agricultura-sustentavel.jpeg";

export const LoginScreen = () => {
    const theme = useTheme();
    // Breakpoint 'sm' geralmente é 600px. Abaixo disso é mobile.
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { showNotification, NotificationModal } = useNotification();
    const loaderRef = useRef<LoadingIndicatorRef>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState<UserDTO>({
        login: "",
        password: "",
        avatar: ""
    });

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validateForm = (): boolean => {
        if (!user?.login.trim()) {
            showNotification(ActionType.Warning, "Login inválido", "Por favor, preencha o campo de login.", () => {});
            return false;
        }
        if (!user?.password.trim()) {
            showNotification(ActionType.Warning, "Senha vazia", "Por favor, informe sua senha.", () => {});
            return false;
        }
        return true;
    };

    const submitLogin = async () => {
        if (!validateForm()) return;

        loaderRef.current?.start();
        
        try {
            const { success, data, message } = await ApiServices.login(user);

            if (success && data) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", data.fullName);
                localStorage.setItem("login", data.login);
                localStorage.setItem("avatar", data.avatar || ""); 
                navigate("/lista_espera");
            } else {
                showNotification(ActionType.Warning, "Falha no Login", message || "Credenciais inválidas", () => {});
            }
        } catch (error) {
            console.error(error);
            showNotification(ActionType.Error, "Erro de Conexão", "Não foi possível conectar ao servidor.", () => {});
        } finally {
            loaderRef.current?.done();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') submitLogin();
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            
            // --- Lógica do Background ---
          backgroundColor: isMobile ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
            backgroundImage: isMobile ? "none" : `url(${BG_IMAGE_URL})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // O blend mode escurece a imagem para o cartão branco se destacar mais
            backgroundBlendMode: isMobile ? 'normal' : 'darken', 
        }}>
            <LoadingIndicator ref={loaderRef} />
            {NotificationModal}

            {/* Mudei maxWidth para 'sm' (small) que é maior que 'xs' (extra small) */}
            <MuiContainer maxWidth="sm" disableGutters={isMobile}>
                <Paper 
                    elevation={isMobile ? 0 : 12} // Sombra mais forte no desktop
                    sx={{
                        // Padding aumentado no desktop (6 = 48px)
                        padding: isMobile ? 3 : 6, 
                        borderRadius: isMobile ? 0 : 4,
                        
                        // --- Efeito Glassmorphism (Vidro) ---
                        backgroundColor: isMobile 
                            ? "#FFFFFF" 
                            : "rgba(255, 255, 255, 0.41)", // Leve transparência
                        backdropFilter: isMobile ? "none" : "blur(12px)", // Borra o fundo atrás do cartão
                        
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        
                        // Altura total no mobile para centralizar
                        minHeight: isMobile ? '100vh' : 'auto', 
                        justifyContent: isMobile ? 'center' : 'flex-start'
                    }}
                >
                    {/* LOGO AREA */}
                    <Box 
                        sx={{ 
                            mb: 5, // Margem aumentada
                            textAlign: 'center',
                            width: '100%'
                        }}
                    >
                        {/* Se tiver a imagem importada, use aqui. Caso contrário, placeholder */}
                        <img 
                            src="src/assets/logo/logo.jpg" 
                            alt="Agrion Logo"
                            style={{ 
                                maxWidth: isMobile ? '200px' : '380px', // Logo maior no desktop
                                width: '100%', 
                                height: 'auto',
                                marginBottom: '16px'
                            }} 
                        />
           
                    </Box>

                    {/* FORM AREA */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        <TextField
                            fullWidth
                            placeholder="Usuário"
                            name="login"
                            value={user.login}
                            onChange={handleLoginChange}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            autoComplete="username"
                            // Aumentando a altura visual do input no desktop
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    paddingLeft: 1,
                                         borderRadius:3,
                                    height: isMobile ? 50 : 56, // Input ligeiramente mais alto
                                    backgroundColor: isMobile ? grey[50] : "#FFFFFF"
                                },
                                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                    borderColor: green[500],
                                    borderWidth: 2
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: green[600], fontSize: 28 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            placeholder="Senha"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={user.password}
                            onChange={handleLoginChange}
                            onKeyDown={handleKeyDown}
                            variant="outlined"
                            autoComplete="current-password"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    paddingLeft: 1,
                                    borderRadius:3,
                                    height: isMobile ? 50 : 56,
                                    backgroundColor: isMobile ? grey[50] : "#FFFFFF"
                                },
                                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                    borderColor: green[500],
                                    borderWidth: 2
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: green[600], fontSize: 28 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
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
                                mt: 2,
                                height: 56, // Botão mais alto
                                borderRadius: 2,
                                backgroundColor: green[700],
                                fontWeight: "800",
                                fontSize: "1.1rem", // Texto maior
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                boxShadow: "0 6px 20px rgba(46, 125, 50, 0.25)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: green[900],
                                    transform: "translateY(-2px)", // Efeito de elevação leve
                                    boxShadow: "0 8px 25px rgba(46, 125, 50, 0.4)",
                                },
                            }}
                        >
                            ENTRAR
                        </Button>
                    </Box>

                    {/* FOOTER */}
                    <Box sx={{ mt: 6, opacity: 0.7 }}>
                        <Typography variant="caption" color="textSecondary" align="center" display="block">
                            © {new Date().getFullYear()} Agrion. Sistema de Controle.
                        </Typography>
                    </Box>

                </Paper>
            </MuiContainer>
        </Box>
    );
};