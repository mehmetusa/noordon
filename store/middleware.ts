import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
   publicRoutes: ["api/:path*"]
  // publicRoutes: [
  //   "/api/products",       // ✅ Add this
  // ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};