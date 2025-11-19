import { useAppContext } from "./providers/Marketplace";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const AppContext = () => {
    const appContext = useAppContext();
    return (
        <>
            {appContext && (
                <>
                    <div>
                        <h2 className="mb-4 text-2xl font-bold">{appContext.name}</h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{appContext.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>{appContext.id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Icon URL</TableCell>
                                <TableCell>{appContext.iconUrl}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Installation ID</TableCell>
                                <TableCell>{appContext.installationId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>State</TableCell>
                                <TableCell>{appContext.state}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{appContext.type}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </>
            )}
        </>
    );
}

export default AppContext;

