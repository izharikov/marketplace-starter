"use client";

import { useEffect, useState } from "react";
import { ApplicationContext } from "@sitecore-marketplace-sdk/client";
import { useAppContext } from "@/components/providers/Marketplace";

function DashboardWidget() {
  const appContext = useAppContext();

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h1>Welcome to {appContext?.name}</h1>
      <p>This is a dashboard widget extension.</p>
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
    </div>
  );
}

export default DashboardWidget;
