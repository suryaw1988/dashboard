// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Login from "@material-ui/icons/LockOpen";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import SalesPerson from "views/SalesPerson/SalesPerson.js";
import DetailSales from "views/DetailSales/DetailSales.js";
import LoginPage from "views/Pages/LoginPage.js";
import RegiterPage from "views/Pages/RegisterPage.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/salesperson",
    name: "Sales Person",
    rtlName: "Sales Person",
    icon: Person,
    component: SalesPerson,
    layout: "/admin",
    hidden: false
  },
  {
    path: "/detailsales",
    name: "Manpower Detail",
    rtlName: "Manpower Detail",
    icon: Person,
    component: DetailSales,
    layout: "/admin",
    hidden: true
  },
  {
    path: "/login",
    name: "Login",
    rtlName: "Login",
    icon: Login,
    component: LoginPage,
    layout: "/auth",
    hidden: true
  },
  {
    path: "/register",
    name: "Regiter",
    rtlName: "Regiter",
    icon: Login,
    component: RegiterPage,
    layout: "/auth",
    hidden: true
  }
];

export default dashboardRoutes;
