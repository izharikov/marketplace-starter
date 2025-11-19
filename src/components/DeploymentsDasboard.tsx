import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PaginatedDeploymentsResponse } from "@/types/deployment";
import { Spinner } from "./ui/spinner";
import { Circle, CircleCheck, CircleX } from "lucide-react";

const DeploymentStatus = ({ status }: { status: number }) => {
    const statusMap: Record<number, [string, () => React.ReactNode]> = {
        0: ["Not started", () => <Circle className="text-muted-foreground mr-1" />],
        1: ["In progress", () => <Spinner className="size-4 text-primary mr-1" />],
        2: ["Success", () => <CircleCheck className="text-success mr-1" />],
        3: ["Failed", () => <CircleX className="text-red-700 mr-1" />],
        4: ["Skipped", () => <CircleX className="text-muted-foreground mr-1" />],
    };
    return (
        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold}`}>
            {statusMap[status][1]()}
            {statusMap[status][0]}
        </div>
    )
}


export const DeploymentsDashboard = () => {
    const [deployments, setDeployments] = useState<PaginatedDeploymentsResponse>();
    const [state, setState] = useState<"loading" | "error" | "success">("loading");
    useEffect(() => {
        fetch("/api/deployments")
            .then((res) => res.json())
            .then((data) => {
                setDeployments(data);
                setState("success");
            });
    }, []);
    return (
        <>
            {state === "loading" && <Spinner className="size-10 text-primary" />}
            {state === "success" && deployments && <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Environment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deployments.data.map((deployment) => (
                        <TableRow key={deployment.id}>
                            <TableCell>
                                <a href={`https://deploy.sitecorecloud.io/projects/2oPjtdVkwbke4WWQhJzMk/environments/42vfVfhRWTQ2kLS6nqUhk7/deployments?organization=org_Ih9vHlhOvNqXRg7A`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-primary hover:underline"
                                    >
                                    {deployment.projectName}</a>
                            </TableCell>
                            <TableCell>{deployment.environmentName}</TableCell>
                            <TableCell>{deployment.createdAt}</TableCell>
                            <TableCell>
                                <DeploymentStatus status={deployment.deploymentStatus} />
                            </TableCell>
                            <TableCell>
                                <a
                                    href={`https://deploy.sitecorecloud.io/projects/${deployment.projectId}/environments/${deployment.environmentId}/deployments/${deployment.id}?organization=${deployment.organizationId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-primary hover:underline"
                                    >
                                    Logs</a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>}
        </>
    )
};