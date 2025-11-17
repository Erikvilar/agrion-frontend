
import { InfoModal, type ActionTypeType } from "../components/modal-informativo/Component";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { Box, Button } from "@mui/material";
import type React from "react";


interface NotificationProps {
  type?: ActionTypeType;
  title: string;
  message: string | React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; 
}

const Notification = ({ type, title, message, isOpen, onClose, onConfirm }: NotificationProps) => {

  const switchType = (type?: ActionTypeType) => {
    switch (type) {
      case "info":
        return <InfoRoundedIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />;
      case "success":
        return <CheckCircleRoundedIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />;
      case "warning":
        return <WarningAmberRoundedIcon sx={{ fontSize: 48, color: '#f9a825', mb: 2 }} />;
      case "error":
        return <ErrorRoundedIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />;
      default:
        return <></>;
    }
  };

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      type={type}
      title={title}
      icon={switchType(type)}
      message={
        <Box display="flex" flexDirection="column" alignItems="center">
          <span>{message}</span>
          {onConfirm && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          )}
        </Box>
      }
    />
  );
};

export default Notification;
