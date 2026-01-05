import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const breadcrumbMap = {
  owner: 'Ιδιοκτήτης',
  vet: 'Κτηνίατρος',
  profile: 'Προφίλ',
  pets: 'Κατοικίδια',
  declarations: 'Δηλώσεις',
  appointments: 'Ραντεβού',
};

function AppBreadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ mb: 3, px : 2, py : 1 }}
      separator={
        <PlayArrowIcon sx={{ fontSize: 14, color: "text.secondary" }} />
      }
    >
      {/* Home always first */}
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="inherit"
        sx={{ fontWeight: "bold" }}
      >
        Αρχική
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label =
          breadcrumbMap[value] ||
          value.charAt(0).toUpperCase() + value.slice(1);

        return isLast ? (
          // Current page: Typography, bold + underline
          <Typography
            key={to}
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
            color="text.primary"
          >
            {label}
          </Typography>
        ) : (
          // Other pages: Link, bold
          <Link
            component={RouterLink}
            to={to}
            key={to}
            underline="hover"
            color="inherit"
            sx={{ fontWeight: "bold" }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default AppBreadcrumbs;
