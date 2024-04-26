import { auth } from "./auth";
import { NextResponse } from "next/server";

export const apiAuthPrefix = "/api/auth";
export const uploadthingPreflix = "/api/uploadthing";

export default auth((req) => {
  console.log("💩💩💩💩", req.nextUrl.pathname);
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isUploadthingPreflix = nextUrl.pathname.startsWith(uploadthingPreflix);

  if (isApiAuthRoute || isUploadthingPreflix) {
    return NextResponse.next();
  }

  if (!isLoggedIn && nextUrl.pathname !== "/") {
    return Response.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
