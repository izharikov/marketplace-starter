"use client";

import AppContext from "@/components/AppContext";

function StandaloneExtension() {

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-3xl">
      <div className="space-y-4">
        <AppContext />
      </div>
    </div >
  );
}

export default StandaloneExtension;
