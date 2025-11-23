import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SavingIndicatorProps {
  saving: boolean; 
}

const SavingIndicator: React.FC<SavingIndicatorProps> = ({ saving }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
let timeout: number;

    if (saving) {
      // mostra imediatamente
      setVisible(true);
    } else {
      // mantém visível por +500ms
      timeout = setTimeout(() => setVisible(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [saving]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "8px 12px",
        borderRadius: "8px",
        color: "white",
        position: "fixed",
        top: 230,
        right: 20,
        zIndex: 9999,
      }}
    >
      <CircularProgress size={20} style={{color:"green"}}/>
      <Typography sx={{color:"black"}} variant="body2">Salvando...</Typography>
    </Box>
  );
};

export default SavingIndicator;
