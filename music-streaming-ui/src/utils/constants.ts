// export const API_BASE_URL: string ="https://localhost:44388/api";
export const API_BASE_URL: string ="http://localhost:92/api";



export const FILE_BASE_URL: string = API_BASE_URL.replace(/\/api\/?$/, "");

export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${FILE_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const TOKEN_STORAGE_KEY = "music_app_token";
export const USER_STORAGE_KEY = "music_app_user";
