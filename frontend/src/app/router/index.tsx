import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";

import AuthPage from "@/pages/auth/AuthPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LayoutMenu from "@/widgets/layout/layout_menu";
import MainNotes from "@/pages/notes/MainNotes";
import FeatureNotes from "@/pages/notes/FeatureNotes";
import ArchiveNotes from "@/pages/notes/ArchiveNotes";
import PageNotFound from "@/pages/PageNotFound";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<LayoutMenu />}>
          <Route index element={<Navigate to="/MainNotes" replace />} />
          <Route path="/MainNotes" element={<MainNotes />} />
        </Route>

        <Route path="/Feature" element={<LayoutMenu />}>
          <Route path="/Feature" element={<FeatureNotes />} />
        </Route>
        <Route path="/Archive" element={<LayoutMenu />}>
          <Route path="/Archive" element={<ArchiveNotes />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </>,
  ),
);
