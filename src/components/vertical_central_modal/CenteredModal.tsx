import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 1. Interface para o Ref (O que o Pai pode chamar)
export interface ModalRef {
  open: () => void;
  close: () => void;
}

// 2. Interface para as Props (Configuração visual)
interface ModalProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// 3. O Componente com forwardRef
export const CenteredModal = forwardRef<ModalRef, ModalProps>((props, ref) => {
  const { title, children, maxWidth = 'sm' } = props;
  
  // ESTADO INTERNO: O pai não precisa saber que isso existe
  const [isOpen, setIsOpen] = useState(false);

  // Expõe métodos para o pai manipular este componente
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
    >

      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo Central */}
      <DialogContent dividers>
        <Box sx={{ pt: 1 }}>
          {children}
        </Box>
      </DialogContent>

      {/* Rodapé com botão Fechar */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="contained" color="error">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
});


CenteredModal.displayName = 'SelfManagedModal';