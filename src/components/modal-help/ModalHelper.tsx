
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import { Typography } from '@mui/material';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70%",
  bgcolor: 'background.paper',
  boxShadow: 10,
  p: 4,
};
const ModalHelper = ()=>{

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

useEffect(()=>{

},[])

  return (
    <div>
      <Button onClick={handleOpen}><HelpIcon />
      <span style={{color:"white"}}>Ajuda</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <div style={{overflowY:"scroll",  maxHeight:'80vh',paddingTop:20}}>
              <button onClick={handleClose} style={{backgroundColor:"transparent", border:"none"}}><CloseIcon/></button>
                <h2 >HELPER</h2>
            <Typography sx={{mt:5}}>
              <h1 style={{color:'red',fontSize:40, textAlign:"center"}}>EM CONSTRUÇÃO</h1>
            </Typography>
            <img src="https://serpstat.com/img/blog/website-prototyping-what-is-it-and-how-to-create-a-prototype/1669289770image4_2_1.png" alt="" />
            </div>
        </Box>
      </Modal>
    </div>
  );
}
export default ModalHelper;