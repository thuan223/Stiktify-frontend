const roleRoutes: Record<string, (string | RegExp)[]> = {
  USERS: [
    "/page/trending-user",
    /^\/page\/detail_user\/[\w-]+$/, // Chấp nhận chữ cái, số và dấu -
    "/page/music-favorite",
    "/page/my-music",
    "/page/my-video",
    "/page/following",
    "/page/profile",
    "/page/search-user-video",
    "/personal/videohistory",
    /^\/page\/share\/[\w-]+$/,
    /^\/page\/shareMusic\/[\w-]+$/,
    /^\/page\/music\/[\w-]+$/,
    "/page/playlist",
    "/page/rankings",
    /^\/page\/rankings\/music\/[\w-]+$/,
    /^\/page\/rankings\/video\/[\w-]+$/,
    /^\/page\/rankings\/creator\/[\w-]+$/,
    "/page/music",
    /^\/page\/store\/[\w-]+$/,
    "/personal/musichistory",
  ],
  GUEST: [
    "/page/trending-guest",
    "/page/rankings",
    /^\/page\/rankings\/music\/[\w-]+$/,
    /^\/page\/rankings\/video\/[\w-]+$/,
    /^\/page\/rankings\/creator\/[\w-]+$/,
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
    "/dashboard/statistic/users",
    "/dashboard/statistic/videos",
    "/dashboard/statistic/musics"
  ],
};

const defaultRoutes: Record<string, string> = {
  USERS: "/page/trending-user",
  GUEST: "/page/trending-guest",
  ADMIN: "/dashboard/user",
};

export { roleRoutes, defaultRoutes };
