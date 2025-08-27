// src/components/profile/MyProjectsPanel.tsx
import React, { useState } from "react";
import { useGetMyProjects } from "@/api/projectApi";
import GenericProjectList from "@/components/profile/projectsTabs/GenericProjectList";

const MyProjectsPanel: React.FC<{ search?: string; status?: string }> = ({ search = "", status = "" }) => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetMyProjects(page, true, search, status);

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
