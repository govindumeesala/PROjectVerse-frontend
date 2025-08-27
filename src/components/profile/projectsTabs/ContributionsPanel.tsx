// src/components/profile/ContributionsPanel.tsx
import React, { useState } from "react";
import { useGetContributedProjects } from "@/api/projectApi";
import GenericProjectList from "@/components/profile/projectsTabs/GenericProjectList";

const ContributionsPanel: React.FC<{ search?: string; status?: string }> = ({ search = "", status = "" }) => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetContributedProjects(page, true, search, status);

  return (
    <GenericProjectList
      title="Contributed Projects"
      projects={projects}
      total={total}
      isLoading={isPending}
      isError={isError}
      page={page}
      setPage={setPage}
      limit={3}
      showOwner={true}
    />
  );
};

export default ContributionsPanel;
