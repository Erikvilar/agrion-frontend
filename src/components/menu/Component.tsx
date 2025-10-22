import { useState, type MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import styles from "./styles.module.css"
import { Box } from "@mui/material";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router";
export default function MenuLeft() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigation = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCadastro = () => {
    navigation("/cadastro")
    handleClose();
  };

  const handleVisualizarLista = () => {
    navigation("/lista_espera")
    handleClose();
  };

  return (
    <Box >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClick}
        size="large"
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem style={{backgroundColor:"green",marginBottom:2}} onClick={handleCadastro}> <span className={styles.text}>Cadastrar</span></MenuItem>
        <MenuItem onClick={handleVisualizarLista} style={{backgroundColor:"green",marginBottom:2}}>
          <span className={styles.text}>Lista de espera<LocalShippingIcon sx={{color:"orange",marginLeft:5}}/></span>
        </MenuItem>
        <MenuItem style={{backgroundColor:green[500]}}>
     <span className={styles.text}>Historico</span>
        </MenuItem>
      </Menu>
    </Box>
  );
}