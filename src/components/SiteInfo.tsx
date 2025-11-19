import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Xmapp } from "@sitecore-marketplace-sdk/xmc";
import { FolderTree } from "lucide-react";

type Props = {
    site: Xmapp.Site;
};

const formatDate = (iso?: string) => {
    if (!iso) return "—";
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
};

export default function SiteInfo({ site }: Props) {
    const {
        id,
        name,
        displayName,
        description,
        thumbnail,
        created,
        hosts,
        supportedLanguages,
        settings,
        properties,
    } = site ?? {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1 p-4 flex flex-col items-center">
                <div className="w-full">
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold flex">
                            <FolderTree className="mr-4" />
                            {displayName || name}
                        </h3>
                        {description && <p className="text-sm text-muted-foreground">
                            {description}
                        </p>}

                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                            {supportedLanguages?.map((language) => (
                                <Badge key={language} size="lg" colorScheme={"primary"}>
                                    {language}
                                </Badge>
                            ))}
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                            <div>ID: <code className="break-all">{id}</code></div>
                            <div>Created: {formatDate(created)}</div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="md:col-span-2">
                <Card className="p-4">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="hosts">Hosts</TabsTrigger>
                            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium mb-2">Settings</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Key</TableHead>
                                                <TableHead>Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {settings && Object.keys(settings).length > 0 ? (
                                                Object.entries(settings).map(([key, value]) => (
                                                    <TableRow key={key}>
                                                        <TableCell className="font-medium">{key}</TableCell>
                                                        <TableCell className="text-muted-foreground break-all">{String((value as any) ?? "—")}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2}>—</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Properties</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Key</TableHead>
                                                <TableHead>Value</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {properties && Object.keys(properties).length > 0 ? (
                                                Object.entries(properties).map(([key, value]) => (
                                                    <TableRow key={key}>
                                                        <TableCell className="font-medium">{key}</TableCell>
                                                        <TableCell className="text-muted-foreground break-all">{String((value as any) ?? "—")}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2}>—</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="hosts">
                            <div className="space-y-3">
                                {(hosts && hosts.length > 0) ? (
                                    hosts.map((host) => (
                                        <div key={host.id} className="p-3 border rounded-md">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="font-semibold">{host.name}</h5>
                                                    <div className="text-sm text-muted-foreground">{host.targetHostname}</div>
                                                    <div className="text-xs text-muted-foreground">Home: <code>{host.homePageId}</code></div>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-sm">
                                                <div><strong>Properties</strong></div>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Key</TableHead>
                                                            <TableHead>Value</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {host.properties && Object.keys(host.properties).length > 0 ? (
                                                            Object.entries(host.properties).map(([key, value]) => (
                                                                <TableRow key={key}>
                                                                    <TableCell className="font-medium">{key}</TableCell>
                                                                    <TableCell className="text-muted-foreground break-all">{String((value as any) ?? "—")}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={2}>—</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">No hosts</div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="raw">
                            <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-96">{JSON.stringify(site, null, 2)}</pre>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
