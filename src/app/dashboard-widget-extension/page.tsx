"use client";

import { DeploymentsDashboard } from "@/components/DeploymentsDasboard";
import { useAppContext, useMarketplaceClient } from "@/components/providers/Marketplace";
import { clientSdkfetch } from "@/utils/xmc/client-sdk-fetch";
import { use, useEffect, useState } from "react";

function DashboardWidget() {

  return (
    <div className="w-full h-full flex justify-center my-auto">
      <DeploymentsDashboard />  
    </div>
  );
}

export default DashboardWidget;
