const roleRoutes: Record<string, string[]> = {
  USERS: [
    "/page/trending-user",
    "/page/detail_user/",
    "/page/music-favorite",
    "/page/my-music",
    "/page/my-video",
    "/page/profile",
    "/page/search-user",
    "/personal/videohistory",
    "/page/share/",
  ],
  GUEST: [
    "/page/trending-guest",
    "/auth/login",
    "/auth/forgotpassword",
    "/auth/register",
    "page/music-guest",
    "/verify/",
  ],
  ADMIN: ["/dashboard/user", "/dashboard/report", "/dashboard/short-video"],
};

const defaultRoutes: Record<string, string> = {
  USERS: "/page/trending-user",
  GUEST: "/page/trending-guest",
  ADMIN: "/dashboard/user",
};

export { roleRoutes, defaultRoutes };
