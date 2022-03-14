import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

import { Home } from "../pages/home/Home";
import { UserList } from "../pages/userList/UserList";
import { User } from "../pages/user/User";
import { NewUser } from "../pages/newUser/NewUser";

import { Auth as Login } from "../pages/auth/Auth";
import { ForgotPassword } from "../pages/forgotPassword/ForgotPassword";
import { MainLayout } from "./MainLayout";

const routes = (isLoggedIn) => [
  {
    path: "/app",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "/dashboard", element: <Home /> },
      { path: "/users", element: <UserList /> },
      { path: "/user/:userId", element: <User /> },
      { path: "/newUser", element: <NewUser /> },
      { path: "/", element: <Navigate to="/app/dashboard" /> },
      //   {
      //     path: 'member',
      //     element: <Outlet />,
      //     children: [
      //       { path: '/', element: <MemberGrid /> },
      //       { path: '/add', element: <AddMember /> },
      //     ],
      //   },
    ],
  },
  {
    path: "/",
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    children: [
      { path: "login", element: <Login /> },
      { path: "forgotPassword", element: <ForgotPassword /> },
      { path: "/", element: <Navigate to="/login" /> },
    ],
  },
];

export default routes;
