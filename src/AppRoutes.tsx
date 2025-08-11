import { Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";
import HomePage from '@/pages/HomePage';
import Layout from "@/Layout/Layout";
import CreateProjectPage from "@/pages/CreateProjectPage";
import ProfilePage from "@/pages/ProfilePage";
import CollabPage from "@/pages/CollabPage";
import LoginSignupPage from "@/pages/LoginSignupPage";
import { useRefreshAccessToken } from "@/api/authApi";

const AppRoutes = () => {
    const { refresh: refreshAccessToken, isPending } = useRefreshAccessToken();
    const didRun = useRef(false);

    useEffect(() => {
      if (didRun.current || isPending) return;

      const refresh = async () => {
        didRun.current = true;
        await refreshAccessToken();
      };

    refresh();
  }, [refreshAccessToken, isPending]);

    return <Routes>
    <Route path="/" element={
      <Layout>
        <HomePage />
      </Layout>
    } />

    <Route path="/auth/login" element={
      <LoginSignupPage />
    } />

    <Route path="/create-project" element={
      <Layout>
        <CreateProjectPage />
      </Layout>
    }  />
    <Route path="/profile" element={
      <Layout>
        <ProfilePage />
      </Layout>
    }  />
    <Route path="/collab" element={
      <Layout>
        <CollabPage />
      </Layout>
    }  />
  </Routes>
}

export default AppRoutes