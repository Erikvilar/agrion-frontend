import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Typography
} from '@mui/material';
import{ forwardRef, useImperativeHandle, useState } from 'react';
import { type ColorPalette } from '@/styles/themeConstants';

export interface OffcanvasRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface OffcanvasProps {
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
  currentTheme: ColorPalette;
}

export const OffCanvasDrawer = forwardRef<OffcanvasRef, OffcanvasProps>((props, ref) => {
  const {
    title,
    children,
    position = 'left',
    width = 450,
    currentTheme
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev)
  }));

  const handleClose = () => setIsOpen(false);

  return (
      <Drawer
          anchor={position}
          open={isOpen}
          onClose={handleClose}
          PaperProps={{
            sx: {

              width: position === 'left' || position === 'right' ? width : '100%',
              height: position === 'top' || position === 'bottom' ? 'auto' : '100%',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: currentTheme.background.paper,
              color: currentTheme.text.primary,
              boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
              borderRight: position === 'left' ? `1px solid ${currentTheme.border.main}` : 'none',
              borderLeft: position === 'right' ? `1px solid ${currentTheme.border.main}` : 'none',
            }
          }}
      >

        <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: "transparent"
            }}
        >
          <Typography variant="h6" fontWeight="800" sx={{ color: currentTheme.text.primary }}>
            {title}
          </Typography>

          <IconButton onClick={handleClose} sx={{ color: currentTheme.text.secondary }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: currentTheme.border.divider }} />


        <Box sx={{
          p: 3,
          flexGrow: 1,
          overflowY: 'auto',

          // 1. Estilização da Scrollbar
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-track": { backgroundColor: currentTheme.scroll.track },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: currentTheme.scroll.thumb,
            borderRadius: 4,
            border: `2px solid ${currentTheme.background.paper}`
          },

          // 2. CORREÇÃO DOS INPUTS E PLACEHOLDERS
          // Força a cor do texto digitado
          "& .MuiInputBase-input": {
            color: currentTheme.text.primary
          },
          // Força a cor do Placeholder (Aqui está a correção principal)
          "& .MuiInputBase-input::placeholder": {
            color: currentTheme.text.disabled,
            opacity: 1 // Necessário pois o browser reduz a opacidade por padrão
          },
          // Estiliza as bordas dos inputs (Outline)
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: currentTheme.border.main
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: currentTheme.text.secondary
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: currentTheme.border.focus
          },
          // Estiliza os Labels (Texto acima do input)
          "& .MuiInputLabel-root": {
            color: currentTheme.text.secondary
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: currentTheme.border.focus
          },
          // Ícones dentro dos inputs (ex: dropdown seta)
          "& .MuiSvgIcon-root": {
            color: currentTheme.text.secondary
          }
        }}>
          {children}
        </Box>

      </Drawer>
  );
});

OffCanvasDrawer.displayName = 'OffCanvasDrawer';