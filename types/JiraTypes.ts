export interface JiraAuth {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

export interface JiraSite {
  id: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}

export interface JiraBoard {
  id: number;
  name: string;
  type: string;
}

export interface JiraSprint {
  id: number;
  self: string;
  state: string;
  name: string;
  startDate: string;
  endDate: string;
  originBoardId: number;
  goal: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee: {
      displayName: string;
    };
    priority: {
      name: string;
    };
    issuetype: {
      name: string;
    };
  };
}
