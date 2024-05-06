import Loading from "@/components/loaders/loading";
import React from "react";

const LoadingAgencyPage = () => {
  return (
    <div className="fixed h-screen w-screen flex justify-center items-center">
      <Loading></Loading>
    </div>
  );
};

export default LoadingAgencyPage;
