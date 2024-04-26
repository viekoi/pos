

import React from "react";
import Navigation from "./_components/navigation";

import { getAuthUserDetail } from "@/lib/queries";

const layout = async ({ children }: { children: React.ReactNode }) => {

  const user = await getAuthUserDetail()

  return (
    <main className="h-full">
      <Navigation user={user} />
      {children}
    </main>
  );
};

export default layout;
