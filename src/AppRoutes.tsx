import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/Layout/Layout";
import CreateProjectPage from "@/pages/CreateProjectPage";
import ProfilePage from "@/pages/ProfilePage";
import CollabPage from "@/pages/CollabPage";
import LoginSignupPage from "@/pages/LoginSignupPage";
import ProjectPage from "./pages/ProjectPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />

      <Route path="/" element={<LoginSignupPage />} />

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
    </Routes>
  );
};

export default AppRoutes;
