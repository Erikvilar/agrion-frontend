
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import Drawer, { type DrawerProps } from "@mui/material/Drawer";
import { motion } from "framer-motion";
import type CadastroDTO from "../../model/CadastroDTO";


type CadastroField = {
  name: keyof CadastroDTO;
  label: string;
  placeholder?: string;
  error?: boolean;
  helper?: string;


  type?: "text" | "select";
  options?: string[];
};
interface Errors {
  cpf?: boolean;
  pesoVazio?: boolean;
}

interface LateralFormDrawerProps extends Omit<DrawerProps, "children"> {
  open: boolean;
  onClose: () => void;
  cadastro: CadastroDTO | null;
  handleCadastro: (e: any) => void;
  errors: Errors;
  submitCadastro: () => void;
}
export function LeftModal({
  open,
  onClose,
  cadastro,
  handleCadastro,
  errors,
  submitCadastro,
  ...props
}: LateralFormDrawerProps) {

const cadastroFields: CadastroField[] = [
  { name: "nomeMotorista", label: "Nome do motorista", placeholder: "Digite o nome completo" },

  { name: "telefone", label: "Whatsapp/Telefone", placeholder: "Ex: (11) 99999-9999" },

  { name: "cpf", label: "CPF", placeholder: "000.000.000-00", error: errors.cpf, helper: "CPF inválido" },

  { name: "placa", label: "Placa do caminhão", placeholder: "Ex: ABC-1234" },

  { name: "produto", label: "Produto", placeholder: "Produto" },

  {
    name: "tipoProduto",
    label: "Tipo do produto",
    type: "select",
    options: ["GRANEL", "BAGS", "SACARIA"],
  },
   {
    name: "operacao",
    label: "Tipo de operacao",
    type: "select",
    options: ["CARREGAMENTO", "DESCARREGAMENTO"],
  },


  { name: "pesoVazio", label: "TARA", placeholder: "Ex: 7000" },

  { name: "marca", label: "Marca", placeholder: "Ex: Volvo" },
];
if (!cadastro) {
  return null; 
}
  return (
       <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "88vw",
          maxWidth: 420,
          padding: 3,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
      }}
      {...props}
    >
      <Box
        component={motion.div}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          overflowY: "auto",
          height: "100%",
          pb: 4,
          pr: 1,
        }}
      >
        {/* Cabeçalho */}
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          color={green[700]}
          sx={{
            letterSpacing: 0.5,
            mb: 1,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          🚛 Cadastro de Veículo
        </Typography>

        <Divider sx={{ mb: 1 }} />

{cadastroFields.map((field) => (
  <FormControl key={field.name} sx={{ width: "100%" }}>
    <Typography
      fontWeight={600}
      color={grey[800]}
      fontSize="0.9rem"
      sx={{ mb: 0.5, ml: 0.5 }}
    >
      {field.label}
    </Typography>

    {field.type === "select" ? (
      <Select
        size="small"
        fullWidth
        name={field.name}
        value={cadastro[field.name] || ""}
        onChange={handleCadastro}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <MenuItem value="">
          <em>Selecione…</em>
        </MenuItem>

        {field.options?.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    ) : (
      <TextField
        size="small"
        fullWidth
        name={field.name}
        placeholder={field.placeholder}
        value={cadastro[field.name] || ""}
        onChange={handleCadastro}
        error={!!field.error}
        helperText={field.error ? field.helper : ""}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": { borderColor: grey[300] },
            "&:hover fieldset": { borderColor: green[500] },
            "&.Mui-focused fieldset": { borderColor: green[600] },
          },
        }}
      />
    )}
  </FormControl>
))}

        {/* Botão */}
        <Button
          variant="contained"
          onClick={submitCadastro}
          sx={{
            mt: 3,
            py: 1.4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: 0.5,
            background: `linear-gradient(135deg, ${green[500]} 0%, ${green[700]} 100%)`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            "&:hover": {
              background: `linear-gradient(135deg, ${green[600]} 0%, ${green[800]} 100%)`,
              boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            },
          }}
        >
          Incluir veículo
        </Button>
      </Box>
    </Drawer>
  );
}
