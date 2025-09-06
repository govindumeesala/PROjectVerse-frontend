// src/components/profile/ContributionsPanel.tsx
import React, { useState } from "react";
import { useGetContributedProjects } from "@/api/projectApi";
import GenericProjectList from "@/components/profile/projectsTabs/GenericProjectList";

type Props = {
  search?: string;
  status?: string;
  username?: string;
}

const ContributionsPanel: React.FC<Props> = ({ search = "", status = "", username = "" }) => {
  const [page, setPage] = useState(1);
  const { projects, total, isPending, isError } = useGetContributedProjects(username, page, true, search, status);

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
