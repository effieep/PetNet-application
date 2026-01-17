import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ListSubheader } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import LoginDialog from "../components/login.js";
import Breadcrumbs from "../components/BreadCrumbs.jsx";


function NavBar() {
  
  
  const { user, isLoggedIn, logout } = useAuth();
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [ownerAnchorEl, setOwnerAnchorEl] = React.useState(null);
  const [vetAnchorEl, setVetAnchorEl] = React.useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  
  useEffect(() => {
    setProfileAnchorEl(null); 
    setOwnerAnchorEl(null);
    setVetAnchorEl(null);
  }, [user]);

  const ownerOpen = Boolean(ownerAnchorEl);
  const vetOpen = Boolean(vetAnchorEl);
  const profileOpen = Boolean(profileAnchorEl);
  
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
  
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  }

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  }
  

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
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {!isLoggedIn ? (
              <>
                {/* LOGIN */}
                <Button
                  onClick={() => setLoginOpen(true)}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    backgroundColor: "#F1D77A",
                    borderRadius: 20,
                    px: 4,
                    py: 1,
                    mr: 2,
                    transition: "background-color 0.25s ease",
                    "&:hover": { backgroundColor: "#e6c85f" },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#373721" }}>
                    Σύνδεση
                  </Typography>
                </Button>
                <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />


                {/* SIGNUP */}
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#3f4143ff",
                    borderRadius: 20,
                    px: 4,
                    py: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "white" }}>
                    Εγγραφή
                  </Typography>
                </Button>
              </>
            ) : (
              <>
              <Box sx = {{display: "flex", flexDirection: "column", alignItems: "center", gap: 1, position: "relative", right: 40 }}>
                {/* USER INFO */}
                <img src="/Generic_avatar.png" alt="User Icon" style={{ height: 55, marginRight: 8 }} />

                {/* LOGOUT */}
                <Button
                  onClick={handleProfileClick}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#1D5128",
                    borderRadius: 20,
                    px: 1,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "#7bb875ff",
                    },
                  }}
                  >
                    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#A4DDA7" }}>
                      Το προφίλ μου
                    </Typography>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.2s",
                        color: "#373721",
                      }}
                    />
                  </Button>
                  <Menu
                    id="profile-menu"
                    anchorEl={profileAnchorEl}
                    open={profileOpen}
                    onClose={handleProfileClose}
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
                        backgroundColor: "#eee5c4ff",
                        borderRadius: "20px",
                        "& .MuiMenuItem-root": {
                          fontSize: "0.98rem",
                          justifyContent: "center",
                          textAlign: "center",
                          borderBottom: "1px inset #000000ff",
                          },
                      },
                    }}
                    MenuListProps={{
                      disablePadding: true,
                    }}  
                  >
                    <ListSubheader
                      onClick={handleProfileClose}
                      sx={{
                        borderBottom: "3px inset #000000ff",
                        fontWeight: 790,
                        fontSize: "1rem",
                        color: "#000000ff",
                        backgroundColor: "#b4dd8dff",
                        textAlign: "center",
                        py: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 790,
                            lineHeight: 1.2,   
                          }}
                        >
                          Καλωσήρθες, {user.name}!
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            lineHeight: 1.1,   
                            mt: 0.9,  
                            color: "#31381cff",         
                          }}
                        >
                          {user.role === "owner" ? "Ιδιοκτήτης/τρια" : "Κτηνίατρος"}
                        </Typography>
                      </Box>
                    </ListSubheader>
                    <MenuItem 
                      onClick={handleProfileClose} 
                      component={Link} 
                      // Αν ο ρόλος είναι vet, πήγαινε στο /vet/info, αλλιώς στο /owner/info
                      to={user?.role === "vet" ? "/vet/info" : "/owner/info"} 
                      sx={{ color: "#000000ff", fontWeight: 700 }}
                    >
                      Προφίλ
                    </MenuItem>
                    <MenuItem onClick={logout} sx={{color: "#bb1515ff", fontWeight: 700}}>Αποσύνδεση</MenuItem>
                  </Menu>
              </Box>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔹 BOTTOM BAR (PAGES) */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#d6c47cff",
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
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 3,
                backgroundColor: "#DCB342",
                overflow: "visible",
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: '50%',
                  transform: 'translate(50%, -50%) rotate(45deg)',
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  zIndex: 0,
                  backgroundColor: "#DCB342",
                },
              },
            }}
            MenuListProps={{
              sx: { p: 1 } 
            }}
          >
            {[
              { label: "Δυνατότητες", link: "/owner" },
              { label: "Αναζήτηση Κτηνιάτρου", link: "/owner/search-vet" },
              { label: "Χάθηκε/Βρέθηκε Ζώο", link: "/lost-found" },
              { label: "Το προφίλ μου", link: "/owner/info" }
            ].map((item) => (
              <>
              <MenuItem 
                key={item.label}
                onClick={handleOwnerClose}
                component={Link}
                to={item.link}
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  borderRadius: 2, 
                  color: "#373721", 
                  fontWeight: 600,
                  my: 0.5, 
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#e9c258",
                    transform: "scale(1.02)" 
                  }
                }}
              >
                {item.label}
              </MenuItem>
              {item.label !== "Το προφίλ μου" && <Box sx={{ borderBottom: '1px solid #57522aff'}} />}
            </>
            ))}
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
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 3,
                backgroundColor: "#DCB342",
                overflow: "visible",
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: '50%',
                  transform: 'translate(50%, -50%) rotate(45deg)',
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  zIndex: 0,
                  backgroundColor: "#DCB342",
                },
              },
            }}
            MenuListProps={{
              sx: { p: 1 } 
            }}
          >
            {[
              { label: "Δυνατότητες", link: "/vet" },
              { label: "Διαχείριση Ζώων", link: "/vet/manage-pets" },
              { label: "Διαχείριση Ραντεβού", link: "/vet/manage-appointments" },
              { label: "Το προφίλ μου", link: "/vet/info" }
            ].map((item) => (
              <>
              <MenuItem 
                key={item.label}
                onClick={handleVetClose}
                component={Link}
                to={item.link}
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  borderRadius: 2, 
                  color: "#373721", 
                  fontWeight: 600,
                  my: 0.5, 
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#e9c258",
                    transform: "scale(1.02)" 
                  }
                }}
              >
                {item.label}
              </MenuItem>
              {item.label !== "Το προφίλ μου" && <Box sx={{ borderBottom: '1px solid #57522aff'}} />}
            </>
            ))}
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
      <Breadcrumbs />
    </Box>
  );
}

export default NavBar;
