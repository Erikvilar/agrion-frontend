import React from "react";
import { Modal, Box, Typography, Button, Backdrop, Grow, useTheme, useMediaQuery} from "@mui/material";
import { useIsMobile } from "../../hooks/useIsMobile";



export const ActionType = {
  Info: "info",
  Success: "success",
  Warning: "warning",
  Error: "error"
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

type InfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type?: ActionType;
  title: string;
  icon: React.ReactElement,
  message: string;
};

const typeColors = {
  info: "#2f86eb",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
};



export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  type = "info",
  title,
  icon,
  message
}) => {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
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
          <Typography
            variant="h5"
            sx={{
              color: typeColors[type],
              textAlign: 'center',
              fontWeight: 500,
              letterSpacing: '0.75px',
              textShadow: '0.5px 0.5px 1px rgba(255, 255, 255, 0.1)',
              mt: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}>
              {title}
              {icon}
            </Box>

          </Typography>

          {/* Mensagem */}
          <Typography
            sx={{
              mt: 2,
              mb: 3,
              px: 2, // padding horizontal para evitar que o texto fique muito colado nas bordas
              maxWidth: "640px", // controla largura máxima do bloco de texto
              textAlign: "center",
              textShadow: '0.5px 0.5px 1px rgba(255, 255, 255, 0.1)',
              color: "#5e5e5eff", // contraste levemente mais suave que #333
              fontSize: isMobile ? "1.05rem" : "1.15rem", // melhora leitura, especialmente em desktop
              lineHeight: 1.75, // mais espaçamento entre linhas para olhos descansarem
              letterSpacing: "0.25px", // pequeno ajuste que melhora leitura em blocos de texto
              fontWeight: 400, // evita que a fonte fique muito leve (especialmente com Montserrat/Inter)
            }}
          >
            {message}
          </Typography>
          <Button

            onClick={onClose}
            sx={{
              backgroundColor: typeColors[type],
              color: "#000000ff",
              width:'80%',
              fontFamily: "monospace",
              fontWeight: 450,
              zIndex:2,
              fontSize: 16,
              "&:hover": {
                backgroundColor: "black",
                fontWeight: 200,
                color: typeColors[type],
                filter: "brightness(0.9)",
              },
              transition: "all 0.2s ease-in-out",
              borderRadius: 2,
              py: 1.5,

            }}>
            Compreendo
          </Button>
        </Box>
      </Grow>
    </Modal>
  );
};
