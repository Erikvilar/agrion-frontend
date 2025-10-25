import { useState, type MouseEvent } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryIcon from "@mui/icons-material/History";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

type MenuLeftProps = {
  avatar: string;
 setIsOpen: (open: boolean) => void;
 isPageLogin:boolean;
};

export default function MenuLeft({ avatar,isPageLogin,setIsOpen}: MenuLeftProps) {
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
   setIsOpen(true)
  };

  const handleVisualizarLista = () => {
    navigation("/lista_espera");
    handleClose();
  };

  const userLogged = localStorage.getItem("token")
  console.log(isPageLogin, !userLogged)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px: 2,
        py: 0,
        pb:5,
        backgroundColor: "transparent",
        
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Botão hamburguer com animação */}
      <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }}>
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={handleClick}
          size="large"
          sx={{
            color: green[700],
        
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: green[100],
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </motion.div>

      {/* Avatar com animação suave */}
      <motion.div
        whileHover={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Box>
          <img
            src={avatar}
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
              border: `2px solid ${green[500]}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />
        </Box>
      </motion.div>

      {/* Menu flutuante */}
      <AnimatePresence>
        {open && (
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
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, y: -10, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: -10, scale: 0.95 },
              transition: { duration: 0.25 },
              sx: {
                borderRadius: 3,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                overflow: "hidden",
          
                minWidth: 180,
              },
            }}
          >
            {!isPageLogin && userLogged && ( 
              <MenuItem
              onClick={handleCadastro}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: green[700],
                "&:hover": {
                  backgroundColor: green[50],
                },
              }}
            >
              <PersonAddAltIcon sx={{ fontSize: 22 }} />
              <Typography fontWeight={600} fontSize="0.9rem">
                Cadastrar
              </Typography>
            </MenuItem>)}
       

            <Divider />

            <MenuItem
              onClick={handleVisualizarLista}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: green[700],
                "&:hover": {
                  backgroundColor: green[50],
                },
              }}
            >
              <LocalShippingIcon sx={{ color: "orange", fontSize: 22 }} />
              <Typography fontWeight={600} fontSize="0.9rem">
                Lista de Espera
              </Typography>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => alert("Em breve!")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: grey[800],
                "&:hover": {
                  backgroundColor: grey[100],
                },
              }}
            >
              <HistoryIcon sx={{ color: green[400], fontSize: 22 }} />
              <Typography fontWeight={600} fontSize="0.9rem">
                Histórico
              </Typography>
            </MenuItem>
          </Menu>
        )}
      </AnimatePresence>
    </Box>
  );
}
