import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";

function NavBar() {

  const [ownerAnchorEl, setOwnerAnchorEl] = React.useState(null);
  const [vetAnchorEl, setVetAnchorEl] = React.useState(null);

  const ownerOpen = Boolean(ownerAnchorEl);
  const vetOpen = Boolean(vetAnchorEl);
  
  const handleOwnerClick = (event) => {
    setOwnerAnchorEl(event.currentTarget);
  };

  const handleOwnerClose = () => {
    setOwnerAnchorEl(null);
  };

  const handleVetClick = (event) => {
    setVetAnchorEl(event.currentTarget);
  };

  const handleVetClose = () => {
    setVetAnchorEl(null);
  };

  

  return (
    <Box>
      {/* 🔹 TOP BAR */}
      <AppBar position="static" sx={{ backgroundColor: "#9a9b6a" }}>
        <Toolbar sx ={{ height: 120 }}>
          {/* LOGO */}
          <Link to="/" >
            <Box
              component="img"
              src="/logo-petnet.svg"
              alt="PetNet Logo"
              sx={{
                height: 50,
                mr: 1,              
              }}
            />
          </Link>
          

          {/* AUTH BUTTONS */}
          <Box sx={{ flexGrow: 1 , alignItems: 'right', display: 'flex', justifyContent: 'flex-end' }}> 
            <Button sx={{ color: "white", textTransform: "none", backgroundColor: "#F1D77A", borderRadius: 20, px: 4, py: 1, marginRight: 2 }}>
              <Typography sx ={{fontWeight: 700, color: "#373721" }}>
                Σύνδεση
              </Typography>
              
            </Button>
            <Button variant="contained" sx={{ ml: 1, textTransform: "none", backgroundColor: "#3f4143ff", borderRadius: 20, px: 4, py: 1  }}>
              <Typography sx ={{fontWeight: 700, color: "white" }}>
              Εγγραφή
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔹 BOTTOM BAR (PAGES) */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#f5e08a",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Button
              component={Link}
              id="home"
              to ="/"
              sx={{
                fontSize: 16,
                mx: 1,
                color: "black",
                textTransform: "none",
                fontWeight: 550,
                px: 8,
              }}
            >
                Αρχική

            </Button>
            <Button
              id="owner-button"
              onClick={handleOwnerClick}
              sx={{
                fontSize: 16,
                mx: 1,
                color: "black",
                textTransform: "none",
                fontWeight: 550,
                px: 8,
              }}
            >
              Ιδιοκτήτης/τρια 
              {
              <KeyboardArrowDownIcon
                sx={{
                  transform: ownerOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            }
            </Button>
            <Menu
              id="owner-menu"
              anchorEl={ownerAnchorEl}
              open={ownerOpen}
              onClose={handleOwnerClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              PaperProps={{
                sx: {
                  "& .MuiMenuItem-root": {
                    border: "0.5px inset #57522aff",
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: "#DCB342",
                    transition: "background-color 0.25s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#fcd445ff",
                    },
                  },
                },
              }}
              MenuListProps={{
                disablePadding: true,
                borderRadius: 10,
              }}  
            >
              <MenuItem onClick={handleOwnerClose} component={Link} to = "/owner">Δυνατότητες</MenuItem>
              <MenuItem onClick={handleOwnerClose}>Αναζήτηση Κτηνιάτρου</MenuItem>
              <MenuItem onClick={handleOwnerClose}>Χάθηκε/Βρέθηκε Ζώο</MenuItem>
              <MenuItem onClick={handleOwnerClose}>Το προφίλ μου</MenuItem>
            </Menu>
          <Button
              onClick={handleVetClick}
              id="vet"
              sx={{
                fontSize: 16,
                mx: 1,
                color: "black",
                textTransform: "none",
                fontWeight: 550,
                px: 7,
              }}
            >
              Κτηνίατρος
              {
              <KeyboardArrowDownIcon
                sx={{
                  transform: vetOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            }
            </Button>
            <Menu
              id="vet-menu"
              anchorEl={vetAnchorEl}
              open={vetOpen}
              onClose={handleVetClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}

              PaperProps={{
                sx: {
                  "& .MuiMenuItem-root": {
                    border: "0.5px inset #57522aff",
                    justifyContent: "center",
                    textAlign: "center",
                    backgroundColor: "#DCB342",
                    transition: "background-color 0.25s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#fcd445ff",
                    },
                  },
                },
              }}
              MenuListProps={{
                disablePadding: true,
                borderRadius: 10,
              }}
            >
              <MenuItem onClick={handleVetClose} component={Link} to ="/vet" >Δυνατότητες</MenuItem>
              <MenuItem onClick={handleVetClose}>Διαχείριση Ζώων</MenuItem>
              <MenuItem onClick={handleVetClose}>Διαχείριση Ραντεβού</MenuItem>
              <MenuItem onClick={handleVetClose}>Το προφίλ μου</MenuItem>
            </Menu>
          <Button
              component={Link}
              to ="/lost-found"
              key="lostfound"
              sx={{
                fontSize: 16,
                mx: 1,
                color: "black",
                textTransform: "none",
                fontWeight: 550,
                px: 8,
              }}
            >
                Χάθηκε/Βρέθηκε Ζώο
            </Button>
          <Button
              component={Link}
              to = "/help"
              key="help"
              sx={{
                fontSize: 16,
                mx: 1,
                color: "black",
                textTransform: "none",
                fontWeight: 550,
                px: 8,
              }}
            >
                Βοήθεια
            </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
