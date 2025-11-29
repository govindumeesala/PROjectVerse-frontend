import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/Layout/Layout";
import CreateProjectPage from "@/pages/CreateProjectPage";
import ProfilePage from "@/pages/ProfilePage";
import CollabPage from "@/pages/CollabPage";
import LoginSignupPage from "@/pages/LoginSignupPage";
import ProjectPage from "./pages/ProjectPage";
import NotificationsPage from "@/pages/NotificationsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />

      <Route path="/auth/login" element={<LoginSignupPage />} />

      <Route
        path="/create-project"
        element={
          <Layout>
            <CreateProjectPage />
          </Layout>
        }
      />
      <Route
        path="/:username"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />
      <Route
        path="/collab"
        element={
          <Layout>
            <CollabPage />
          </Layout>
        }
      />

      <Route
        path="/:username/:slug"
        element={
          <Layout>
            <ProjectPage />
          </Layout>
        }
      />
      <Route
        path="/notifications"
        element={
          <Layout>
            <NotificationsPage />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
