const roleRoutes: Record<string, (string | RegExp)[]> = {
  USERS: [
    "/page/trending-user",
    /^\/page\/detail_user\/[\w-]+$/, // Chấp nhận chữ cái, số và dấu -
    "/page/music-favorite",
    "/page/my-music",
    "/page/my-video",
    "/page/following",
    "/page/profile",
    "/page/search-user",
    "/personal/videohistory",
    /^\/page\/share\/[\w-]+$/,
    /^\/page\/shareMusic\/[\w-]+$/,
    /^\/page\/music\/[\w-]+$/,
    "/page/playlist",
    "/page/music",
    /^\/page\/store\/[\w-]+$/,
  ],
  GUEST: [
    "/page/trending-guest",
    "/auth/login",
    "/auth/forgotpassword",
    "/auth/register",
    "/page/music",
    /^\/verify\/[\w-]+$/,
    /^\/page\/share\/[\w-]+$/,
    /^\/page\/music\/[\w-]+$/,
    /^\/page\/shareMusic\/[\w-]+$/,
    /^\/page\/detail_user\/[\w-]+$/,
  ],
  ADMIN: [
    "/dashboard/user",
    "/dashboard/report",
    "/dashboard/short-video",
    "/dashboard/report/report-video",
    "/dashboard/report/report-music",
    "/dashboard/music",
    "/dashboard/algorithm",
    /^\/page\/detail_user\/[\w-]+$/,
    "/dashboard/ticked",
  ],
};

const defaultRoutes: Record<string, string> = {
  USERS: "/page/trending-user",
  GUEST: "/page/trending-guest",
  ADMIN: "/dashboard/user",
};

export { roleRoutes, defaultRoutes };
