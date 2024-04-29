export const baseurl = import.meta.env.VITE_API_URL;
export const config = {
  headers: {
    Authorization: import.meta.env.VITE_AUTHORIZATION,
    crossDomain: true,
  },
};
