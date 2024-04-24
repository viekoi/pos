"use client";

import { UploadDropzone } from "@/lib/uploadthing";

// here is the problem of sidebar bug remove it and move to global css
// import "@uploadthing/react/styles.css";

interface ImageUploadProps {
  endpoint: "imageUploader";
  value: string | null;
  onChange: (url?: string) => void;
}
import { X } from "lucide-react";
import Image from "next/image";

export const ImageUpload: React.FC<ImageUploadProps> = ({
  endpoint,
  value,
  onChange,
}) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative ">
        <Image
          src={value}
          alt="upload"
          width={150}
          height={200}
          className=" rounded-[10px]"
        />

        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-rose-500 rounded-full p-1 text-white absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};