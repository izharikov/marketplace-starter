"use client";

import { useEffect, useMemo, useState } from "react";
import { useMarketplaceClient, usePreviewContextId } from "@/components/providers/Marketplace";
import { usePagesContext } from "@/utils/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { Agent } from "@sitecore-marketplace-sdk/xmc";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageResponse } from "@/components/ai-elements/message";
import { CircleCheck } from "lucide-react";

function PagesContextPanel() {
  const pageContext = usePagesContext();
  const client = useMarketplaceClient();
  const sitecoreContextId = usePreviewContextId();

  const [pageComponents, setPageComponents] = useState<Agent.GetPageComponentsResponse>();
  const [availableComponents, setAvailableComponents] = useState<Agent.ComponentShortInfo[]>();

  const [loadingAgentsData, setLoadingAgentsData] = useState(false);
  const [recommendations, setRecommendations] = useState<string>();
  const [generateStatus, setGenerateStatus] = useState<'layout' | 'loading' | 'success'>();

  const pageId = useMemo(() => pageContext?.pageInfo?.id, [pageContext]);

  useEffect(() => {
    setLoadingAgentsData(true);
    setRecommendations(undefined);
    setGenerateStatus(undefined);
  }, [pageId, setLoadingAgentsData, setRecommendations, setGenerateStatus]);

  useEffect(() => {
    (async () => {
      if (!pageContext?.pageInfo?.id || !client || !sitecoreContextId) {
        return;
      }
      const pageComponents = await client.query("xmc.agent.pagesGetComponentsOnPage", {
        params: {
          path: {
            pageId: pageContext?.pageInfo?.id || ""
          },
          query: {
            sitecoreContextId,
          }
        }
      });
      setPageComponents(pageComponents.data?.data);

      const availableComponents = await client.query("xmc.agent.pagesGetAllowedComponentsByPlaceholder", {
        params: {
          path: {
            pageId: pageContext?.pageInfo?.id || "",
            placeholderName: "container-1"
          },
          query: {
            sitecoreContextId,
          }
        }
      });
      setAvailableComponents(availableComponents.data?.data);
      setLoadingAgentsData(false);
    })();
  }, [client, pageContext?.pageInfo?.id, sitecoreContextId]);

  const startGenerateMetadata = async () => {
    if (!client || !sitecoreContextId || !pageContext?.siteInfo?.name || !pageContext?.pageInfo?.route) {
      return;
    }

    const { siteInfo, pageInfo } = pageContext;
    setGenerateStatus('layout');
    const renderedResult = await client.mutate("xmc.live.graphql", {
      params: {
        body: {
          query: `query {
  layout(site: "${siteInfo.name}", routePath: "${pageInfo.route}", language: "${pageInfo.language}") {
    item {
      rendered
    }
  }
}`
        },
        query: {
          sitecoreContextId,
        }
      }
    });
    const placeholders = (renderedResult?.data?.data?.layout as any)?.item?.rendered?.sitecore?.route?.placeholders;

    setGenerateStatus('loading');

    const response = await fetch('/api/meta-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: pageInfo,
        content: placeholders['headless-main']
      })
    })
      .then((response) => response.json())

    setRecommendations(response.result);
    setGenerateStatus('success');
  };

  return (
    <div className="w-full h-full flex justify-center my-auto p-4 mb-12">
      <div className="flex flex-col w-full">
        <h2 className="text-lg font-medium mb-2">Agent API</h2>
        <hr />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full">Page Components</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside">
                {!loadingAgentsData && pageComponents && pageComponents.components?.map((comp) => (
                  <li key={comp.id}>
                    {comp.componentName}
                    {comp.dataSource && (` (Data Source: ${comp.dataSource})`)}
                  </li>
                ))}
                {loadingAgentsData && [...Array(5)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-4 w-40 inline-block " />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <hr />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Components 'container-1' placeholder</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside">
                {!loadingAgentsData && availableComponents && availableComponents.map((comp) => (
                  <li key={comp.id}>
                    {comp.name}
                  </li>
                ))}
                {loadingAgentsData && [...Array(5)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-4 w-40 inline-block " />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <hr />
        <div className="flex flex-col justify-center mt-4">
          <h2 className="text-lg font-medium mb-2">Meta Tags Generation</h2>
          <p className="mb-2">Click the button to ask AI to generate meta tags for the page.</p>
          <div>
            <Button onClick={startGenerateMetadata} disabled={['layout', 'loading'].includes(generateStatus ?? '')}>Generate with AI</Button>
          </div>
          {generateStatus && <div className="max-w-full p-2 mt-4 border border-border rounded-md">
            <div className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold">
              {generateStatus === 'layout' &&
                <>
                  <Spinner className="size-4 text-primary mr-1" />
                  Get layout...
                </>}
              {generateStatus === 'loading' &&
                <>
                  <Spinner className="size-4 text-primary mr-1" />
                  Generate meta tags...
                </>}
              {generateStatus === 'success' &&
                <>
                  <CircleCheck className="text-success mr-1" />
                  Generated!
                </>}
            </div>
            {generateStatus === "success" && <>
              <hr />
              <MessageResponse className="p-2">
                {recommendations}
              </MessageResponse>
            </>
            }
          </div>
          }
        </div>
      </div>
    </div >
  );
}

export default PagesContextPanel;