import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import  Home  from "../game/Home";
import App from "../App";
import AddGame from "../game/components/addgame/AddGame";
import { DetailGame } from "../game/components/detailGame/DetailGame";

const Routes = () => {
  const routesForPublic = [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/home/:id",
      element: <DetailGame />,
    },
    {
      path: "/addgame",
      element: <AddGame />,
    },
  ];

  const router = createBrowserRouter(routesForPublic);

  return <RouterProvider router={router} />;
};

export default Routes;
