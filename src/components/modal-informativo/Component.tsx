import React from "react";
import { Modal, Backdrop, Grow, Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { useIsMobile } from "../../hooks/useIsMobile"; // ajusta se necessário
''
export const ActionType = {
  Info: "info",
  Success: "success",
  Warning: "warning",
  Error: "error",
} as const;

// Tipo derivado a partir do ActionType
export type ActionTypeType = typeof ActionType[keyof typeof ActionType];
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // botão de confirmação opcional
  type?: ActionTypeType;
  title: string;
  icon: React.ReactElement;
  message: string | React.ReactNode;
}

const typeColors: Record<string, string> = {
  info: "#2f86eb",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
};

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type = "info",
  title,
  icon,
  message
}) => {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));


  return (
    <Modal
      open={isOpen}
      onClose={(reason) => {
        if (reason === "backdropClick") {
          onClose();
        }
      }}
      BackdropComponent={Backdrop}
      closeAfterTransition
    >
      <Grow in={isOpen} timeout={350}>
        <Box
           sx={{
        backgroundColor: 'white',
        p: isMobile ? 5 : isTablet ? 4.5 : 4,
        borderRadius: 3,
        width: isMobile ? '85%' : isTablet ? '70%' : 609,
        maxWidth: 620,
        height: isMobile ? 300 :250,
        display:"flex",
        justifyContent:"center",
        flexDirection:"column",
        alignItems:"center",
        position: 'absolute',
        top: isMobile ? '35%' : isTablet ? '40%' : '35%',
        left: isMobile ? '8%':'35%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 26,
        outline: 'none',
        borderTop: `8px solid ${typeColors[type]}`,
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 700,
      }}
        >
          {/* TÍTULO e ÍCONE */}
          <Typography
            variant="h5"
            sx={{
              color: typeColors[type],
              textAlign: "center",
              fontWeight: 600,
              letterSpacing: "0.75px",
              mt: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1
            }}
          >
            {icon}
            {title}
          </Typography>

          {/* MENSAGEM */}
          <Typography
            sx={{
              mt: 1,
              mb: 3,
              px: 2,
              maxWidth: "90%",
              textAlign: "center",
              color: "#444",
              fontSize: isMobile ? "1rem" : "1.1rem",
              lineHeight: 1.6,
              letterSpacing: "0.25px"
            }}
          >
            {message}
          </Typography>

          {/* BOTÕES */}
          <Box sx={{ display: "flex", gap: 2, width: "80%", justifyContent: "center" }}>
            {onConfirm && (
              <Button
                onClick={onConfirm}
                sx={{
                  backgroundColor: typeColors[type],
                  color: "#fff",
                  width: "45%",
                  fontWeight: 600,
                  fontSize: 16,
                  "&:hover": {
                    backgroundColor: "#000",
                    color: typeColors[type],
                  },
                  borderRadius: 2,
                  py: 1.5,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Confirmar
              </Button>
            )}


          </Box>
        </Box>
      </Grow>
    </Modal>
  );
};
