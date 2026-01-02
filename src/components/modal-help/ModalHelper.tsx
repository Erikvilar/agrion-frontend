import React from "react";
import {
    Modal,
    Backdrop,
    Grow,
    Box,
    Typography,
    Button,
    alpha
} from "@mui/material";
import { useIsMobile } from "../../hooks/useIsMobile";
// Importe suas constantes de tema. Ajuste o caminho conforme necessário.
import { APP_THEME, type ThemeMode } from "../../styles/themeConstans";

export const ActionType = {
    Info: "info",
    Success: "success",
    Warning: "warning",
    Error: "error",
} as const;

export type ActionTypeType = typeof ActionType[keyof typeof ActionType];

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    type?: ActionTypeType;
    title: string;
    icon: React.ReactElement;
    message: string | React.ReactNode;
    // Nova prop para garantir que o modal siga o tema da tela atual
    themeMode?: ThemeMode;
}

const typeColors: Record<string, string> = {
    info: "#3b82f6",    // Azul
    success: "#10b981", // Verde
    warning: "#f59e0b", // Ambar
    error: "#ef4444",   // Vermelho
};

export const InfoModal: React.FC<InfoModalProps> = ({
                                                        isOpen,
                                                        onClose,
                                                        onConfirm,
                                                        type = "info",
                                                        title,
                                                        icon,
                                                        message,
                                                        themeMode = 'light' // Padrão Light, mas aceita 'dark'
                                                    }) => {
    const isMobile = useIsMobile();

    // Carrega a paleta exata que definimos no themeConstants.ts
    const currentTheme = APP_THEME[themeMode];
    const mainColor = typeColors[type];

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                sx: {
                    backdropFilter: "blur(4px)", // Blur um pouco mais forte para foco total
                    backgroundColor: themeMode === 'dark'
                        ? "rgba(0, 0, 0, 0.6)"
                        : "rgba(0, 0, 0, 0.2)"
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300
            }}
        >
            <Grow in={isOpen} timeout={350}>
                <Box
                    sx={{
                        position: 'relative',
                        // --- AQUI ESTÁ A MÁGICA DA CONSISTÊNCIA ---
                        backgroundColor: currentTheme.background.paper,
                        color: currentTheme.text.primary,

                        borderRadius: 4,
                        boxShadow: themeMode === 'dark'
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" // Sombra mais forte no dark
                            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

                        padding: isMobile ? 3 : 5,
                        width: isMobile ? '90%' : 'auto',
                        maxWidth: 500,
                        minWidth: isMobile ? 0 : 420,
                        outline: 'none',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        // Borda sutil usando a cor do tema
                        border: `1px solid ${currentTheme.border.main}`,
                    }}
                >
                    {/* Círculo do Ícone */}
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            // Fundo do ícone com opacidade baseada na cor do tipo
                            backgroundColor: alpha(mainColor, 0.15),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                            color: mainColor,
                            "& svg": {
                                fontSize: 32,
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                            }
                        }}
                    >
                        {icon}
                    </Box>

                    {/* TÍTULO */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            color: currentTheme.text.primary, // Respeita o tema (Branco ou Cinza Chumbo)
                            mb: 1,
                            letterSpacing: "-0.025em"
                        }}
                    >
                        {title}
                    </Typography>

                    {/* MENSAGEM */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: currentTheme.text.secondary, // Respeita o tema (Cinza Médio)
                            mb: 4,
                            lineHeight: 1.6,
                            maxWidth: "90%"
                        }}
                    >
                        {message}
                    </Typography>

                    {/* BOTÕES */}
                    <Box sx={{ display: "flex", gap: 2, width: "100%", justifyContent: "center" }}>

                        {onConfirm && (
                            <Button
                                onClick={onClose}
                                variant="text"
                                sx={{
                                    color: currentTheme.text.secondary,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    px: 3,
                                    "&:hover": {
                                        backgroundColor: currentTheme.background.hover,
                                        color: currentTheme.text.primary
                                    }
                                }}
                            >
                                Cancelar
                            </Button>
                        )}

                        <Button
                            onClick={onConfirm ? handleConfirm : onClose}
                            variant="contained"
                            disableElevation
                            sx={{
                                flex: onConfirm ? 1 : '0 0 auto',
                                minWidth: 140,
                                backgroundColor: mainColor,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                borderRadius: 2,
                                py: 1.5,
                                // Glow colorido combinando com a cor do alerta
                                boxShadow: `0 4px 14px 0 ${alpha(mainColor, 0.4)}`,
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    backgroundColor: mainColor,
                                    filter: "brightness(0.9)",
                                    transform: "translateY(-1px)",
                                    boxShadow: `0 6px 20px ${alpha(mainColor, 0.6)}`,
                                },
                            }}
                        >
                            {onConfirm ? "Confirmar" : "Entendi"}
                        </Button>
                    </Box>
                </Box>
            </Grow>
        </Modal>
    );
};