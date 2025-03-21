import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Layout from "./Layout/Layout";
import CreateProjectPage from "./pages/CreateProject";
import ProfilePage from "./pages/ProfilePage";
import CollabPage from "./pages/CollabPage";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
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
    </Router>
    
</>

  );
}

export default App;
