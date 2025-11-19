"use client";

import { useState, useEffect } from "react";
import type { ApplicationContext, PagesContext } from "@sitecore-marketplace-sdk/client";
import { useAppContext } from "@/components/providers/Marketplace";
import { useClientQuery } from "@/utils/hooks/useQuery";

function PagesContextPanel() {
  const appContext = useAppContext();
  const pagesContext = useClientQuery("pages.context", { subscribe: true });

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "600px", margin: "2rem auto" }}>
      {pagesContext ? (
        <>
          <h1>Welcome to {appContext?.name}</h1>
          <p>This is a pages context panel extension.</p>
          
          <div className="application-context">
            <h3>Application Context:</h3>
            <ul className="context-details">
              <li><strong>Name:</strong> {appContext?.name}</li>
              <li><strong>ID:</strong> {appContext?.id}</li>
              <li><strong>Icon URL:</strong> {appContext?.iconUrl}</li>
              <li><strong>Installation ID:</strong> {appContext?.installationId}</li>
              <li><strong>State:</strong> {appContext?.state}</li>
              <li><strong>Type:</strong> {appContext?.type}</li>
              <li><strong>URL:</strong> {appContext?.url}</li>
            </ul>
          </div>
          <div className="pages-context">
            <h3>Pages Context:</h3>
            <ul className="context-details">
              <li><strong>Page ID:</strong> {pagesContext.pageInfo?.id}</li>
              <li><strong>Title:</strong> {pagesContext.pageInfo?.name}</li>
              <li><strong>Language:</strong> {pagesContext.pageInfo?.language}</li>
              <li><strong>Path:</strong> {pagesContext.pageInfo?.path}</li>
            </ul>
          </div>
        </>
      ) : (
        <p>No page context available yet.</p>
      )}
    </div>
  );
}

export default PagesContextPanel;
