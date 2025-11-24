"use client";

import React, {
    useEffect,
    useState,
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react";
import {
    ApplicationContext,
    ClientSDK,
} from "@sitecore-marketplace-sdk/client";
import { XMC } from "@sitecore-marketplace-sdk/xmc";

interface ClientSDKProviderProps {
    children: ReactNode;
}

const ClientSDKContext = createContext<ClientSDK | null>(null);
const AppContextContext = createContext<ApplicationContext | null>(null);

export const MarketplaceProvider: React.FC<ClientSDKProviderProps> = ({
    children,
}) => {
    const [client, setClient] = useState<ClientSDK | null>(null);
    const [appContext, setAppContext] = useState<ApplicationContext | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (client) {
            client.query("application.context").then((res) => {
                if (res && res.data) {
                    setAppContext(res.data);
                    console.log("appContext", res.data);
                }
            });
        }
    }, [client]);

    useEffect(() => {
        const init = async () => {
            const config = {
                target: window.parent,
                modules: [XMC],
            };
            try {
                setLoading(true);
                const client = await ClientSDK.init(config);
                setClient(client);
            } catch (error) {
                console.error("Error initializing client SDK", error);
                setError("Error initializing client SDK");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    if (error) {
        return (
            <div>
                <h1>Error initializing Marketplace SDK</h1>
                <div>{error}</div>
                <div>
                    Please check if the client SDK is loaded inside Sitecore Marketplace
                    parent window and you have properly set your app&apos;s extention points.
                </div>
            </div>
        );
    }

    return (
        <ClientSDKContext.Provider value={client}>
            <AppContextContext.Provider value={appContext}>
                {children}
            </AppContextContext.Provider>
        </ClientSDKContext.Provider>
    );
};

export const useMarketplaceClient = () => {
    return useContext(ClientSDKContext);
};

export const useAppContext = () => {
    return useContext(AppContextContext);
};

export const usePreviewContextId = () => {
    const appContext = useAppContext();
    return useMemo(() => appContext?.resourceAccess?.[0]?.context.preview, [appContext]);
}

export const useLiveContextId = () => {
    const appContext = useAppContext();
    return useMemo(() => appContext?.resourceAccess?.[0]?.context.live, [appContext]);
}

// ...

export const MySites = () => {
    const client = useMarketplaceClient();
    const sitecoreContextId = usePreviewContextId();
    const [sites, setSites] = useState<Site[]>([]);
    const loadSites = async () =>{
        if (client && sitecoreContextId) {
            const { data: sites } = await client.query("xmc.xmapp.listSites", {
                params: { query: { sitecoreContextId } }
            });
            if (!sites?.data) {
                return;
            }
            setSites(sites.data as Site[]);
        }
    }

    loadSites();
    return (<> {sites.map(site => <div key={site.id}>{site.name}</div>)} </>);
}

type Site = {
    id: string;
    name: string;
    url: string;
    contextId: string;
    created: string;
    updated: string;
}