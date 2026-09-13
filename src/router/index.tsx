import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";

import LayoutMenu from "../components/Layout/layout_menu";
import MainNotes from "../pages/MainNotes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutMenu />,
    children: [
      {
        index: true,
        element: <Navigate to="/MainNotes" replace />,
      },
      {
        path: "MainNotes",
        element: (
          <Suspense fallback={<div></div>}>
            <MainNotes />
          </Suspense>
        ),
      },
    ],
  },
]);
