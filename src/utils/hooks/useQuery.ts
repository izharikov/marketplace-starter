import { useEffect, useState } from "react";

import { QueryKey, QueryOptions, QueryResult } from "@sitecore-marketplace-sdk/client";
import { useMarketplaceClient } from "@/components/providers/Marketplace";

export function useClientQuery<K extends QueryKey>(
    key: K,
    queryOptions?: QueryOptions<K>) {
    const client = useMarketplaceClient();
    const [result, setResult] = useState<QueryResult<K>['data']>();
    useEffect(() => {
        client.query(key, queryOptions)
            .then((res) => {
                setResult(res.data);
            })
            .catch((error) => {
                setResult(error);
            });

    }, [client, key, queryOptions]);

    return result;
};

export const usePagesContext = () => useClientQuery("pages.context");
