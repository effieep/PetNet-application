// components/LeftSubmenu.jsx
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";


const LeftSubmenu = (
    {submenuItems}
) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100%",
        backgroundColor: "#ceb73388",
        borderRadius: 2,
        maxHeight: '100vh', 
        boxShadow: 3, 
        ml: 2,  
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <List>
        {submenuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              color: "#2f3e2f",
              mx: 1,
              borderBottom: "1px solid #1414145e",
              "&:first-of-type": {
                borderTop: "1px solid #1414145e",
              },
              "&.Mui-hover": {
                backgroundColor: "#f2f3eaff",
              },
              "&.Mui-selected": {
                backgroundColor: "#e4f16a77",
                color: "  #0000008c",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default LeftSubmenu;
