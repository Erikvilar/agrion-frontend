import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 1. O que o Pai pode mandar fazer
export interface OffcanvasRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

// 2. Configurações visuais
interface OffcanvasProps {
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom'; // Posição do slide
  width?: number | string; // Largura do painel (padrão 350px)
}

export const OffCanvasDrawer = forwardRef<OffcanvasRef, OffcanvasProps>((props, ref) => {
  const { 
    title, 
    children, 
    position = 'left', // Bootstrap costuma ser 'start' (left), mas 'end' (right) é comum
    width = 450 
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  // Expõe os métodos para o componente pai
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
      // PaperProps permite estilizar o painel deslizante em si
      PaperProps={{
        sx: {
          width: position === 'left' || position === 'right' ? width : '100%',
          height: position === 'top' || position === 'bottom' ? 'auto' : '100%',
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* --- Cabeçalho (Header) --- */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: 'background.paper' 
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* --- Corpo (Body) com Scroll --- */}
      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
        {children}
      </Box>

      {/* Se quiser um rodapé opcional, pode adicionar aqui */}
    </Drawer>
  );
});

OffCanvasDrawer.displayName = 'CustomOffcanvas';