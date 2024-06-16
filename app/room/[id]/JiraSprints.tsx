"use client";

import { useEffect, useState } from "react";
import { fetchSprints } from "./services";
import { JiraSprint } from "./JiraSprint";
import { JiraSprint as JiraSprintType } from "../../../types/JiraTypes";

interface Props {
  boardId: string;
}

export function JiraSprints({ boardId }: Props) {
  const [sprints, setSprints] = useState<JiraSprintType[]>([]);

  useEffect(() => {
    if (boardId) {
      fetchSprints(boardId)
        .then((sprints: JiraSprintType[]) => {
          setSprints(sprints.values);
        })
        .catch(() => {
          setSprints([]);
        });
    }
  }, [boardId]);

  if (!boardId) {
    return null;
  }

  return (
    <div>
      <div className="mt-4 text-lg font-bold">Sprints</div>
      <div>
        {sprints.map((sprint: JiraSprintType) => (
          <JiraSprint key={sprint.id} sprint={sprint} />
        ))}
      </div>
    </div>
  );
}
