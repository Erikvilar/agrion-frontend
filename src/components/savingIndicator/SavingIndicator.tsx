import  { forwardRef,  useImperativeHandle, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LoadingIndicatorRef } from "../loading-indicator/Component";


const SavingIndicator = forwardRef<LoadingIndicatorRef, {}>((props, ref) => {
  const [visible, setVisible] = useState(false);
    const {} = props;
    useImperativeHandle(ref, () => ({
        start() {
            setVisible(true);
        },
        done() {
            setVisible(false);
        }
    }));

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
});

export default SavingIndicator;
