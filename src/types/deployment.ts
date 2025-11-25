export type ISODateString = string;

export interface Deployment {
  calculatedStatus: number;
  environmentType: string | null;
  isDeploymentFailed: boolean;
  id: string;
  projectId: string;
  projectName: string;
  environmentId: string;
  environmentName: string;
  organizationId: string;
  organizationName: string;
  buildId: string;
  sitecoreMajorVersion: number;
  triggerMessage: string | null;
  startedAt: ISODateString | null;
  completedAt: ISODateString | null;
  provisioningStatus: number;
  provisioningStartedAt: ISODateString | null;
  provisioningCompletedAt: ISODateString | null;
  provisioningLastFailureMessage: string | null;
  buildStatus: number;
  buildStartedAt: ISODateString | null;
  buildCompletedAt: ISODateString | null;
  buildLastFailureMessage: string | null;
  deploymentStatus: number;
  deploymentStartedAt: ISODateString | null;
  deploymentSubmittedTime: ISODateString | null;
  deploymentReconcilingTime: ISODateString | null;
  deploymentCompletedAt: ISODateString | null;
  deploymentLastFailureMessage: string | null;
  postActionStatus: number;
  postActionStartedAt: ISODateString | null;
  postActionCompletedAt: ISODateString | null;
  postActionLastFailureMessage: string | null;
  vercelStatus: number;
  vercelStartedAt: ISODateString | null;
  vercelCompletedAt: ISODateString | null;
  commitId: string | null;
  createdAt: ISODateString;
  createdBy: string | null;
  isCanceled: boolean;
}

export interface PaginatedDeploymentsResponse {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  data: Deployment[];
}
