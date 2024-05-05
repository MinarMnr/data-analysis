import React from "react";

/*
|--------------------------------------------------------------------------
| Site routes
|--------------------------------------------------------------------------
*/

// HomePage
const Home = React.lazy(() => import("./views/site/home/HomePage"));
const Login = React.lazy(() => import("./views/site/login/LoginPage"));
const NewSidbar = React.lazy(() => import("./views/site/newSidbar/NewSidbar"));
const ResetPassword = React.lazy(() =>
  import("./views/site/login/ResetPassword")
);
const EmployeeJoining = React.lazy(() =>
  import("./views/site/joining/RegisterPage")
);

// const TeacherJoining = React.lazy(() =>
//   import("./views/site/register/RegisterPage")
// );
const TeacherJoining = React.lazy(() =>
  import("./views/site/joining/TeacherJoining")
);

const siteRoutes = [
  { path: "/", exact: true, name: "Home", component: Home },
  { path: "/login", exact: true, name: "Login", component: Login },
  { path: "/new-sidbar", exact: true, name: "NewSidbar", component: NewSidbar },
  {
    path: "/register",
    exact: true,
    name: "EmployeeJoining",
    component: EmployeeJoining,
  },
  {
    path: "/reset-password",
    exact: true,
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/teacher-joining",
    exact: true,
    name: "TeacherJoining",
    component: TeacherJoining,
  },
];

// dashboard
const Dashboard = React.lazy(() =>
  import("./views/portal/dashboard/Dashboard")
);
// institute

const AddReport = React.lazy(() => import("./views/portal/report/ReportAdd"));

const EditReport = React.lazy(() => import("./views/portal/report/ReportEdit"));

const CloneReport = React.lazy(() =>
  import("./views/portal/report/ReportClone")
);

//bank
const Bank = React.lazy(() => import("./views/portal/settings/bank/BankList"));
const BankAdd = React.lazy(() =>
  import("./views/portal/settings/bank/BankAdd")
);
const BankEdit = React.lazy(() =>
  import("./views/portal/settings/bank/BankEdit")
);

// routes
const portalRoutes = [
  {
    path: "/portal/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },

  // institute
  {
    path: "/portal/report/newReport/:id",
    exact: true,
    name: "AddReport",
    component: AddReport,
  },

  {
    path: "/portal/report/updateReport/:id",
    exact: true,
    name: "EditReport",
    component: EditReport,
  },
  {
    path: "/portal/report/cloneReport/:id",
    exact: true,
    name: "CloneReport",
    component: CloneReport,
  },
  //settings

  //Bank
  {
    path: "/portal/settings/bank",
    exact: true,
    name: Bank,
    component: Bank,
  },
  {
    path: "/portal/settings/bank/add",
    exact: true,
    name: BankAdd,
    component: BankAdd,
  },
  {
    path: "/portal/settings/bank/:id/edit",
    exact: true,
    name: BankEdit,
    component: BankEdit,
  },
];

export { portalRoutes, siteRoutes };
