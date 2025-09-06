// src/components/profile/MyProjectsPanel.tsx
import React, { useState } from "react";
import { useGetUserProjects } from "@/api/projectApi";
import GenericProjectList from "@/components/profile/projectsTabs/GenericProjectList";

const MyProjectsPanel: React.FC<{ username?: string; search?: string; status?: string }> = ({ username, search = "", status = "" }) => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetUserProjects(username, page, true, search, status);

  return (
    <GenericProjectList
      title="My Projects"
      projects={projects}
      total={total}
      isLoading={isPending}
      isError={isError}
      page={page}
      setPage={setPage}
      limit={3}
      showOwner={false}
    />
  );
};

export default MyProjectsPanel;
