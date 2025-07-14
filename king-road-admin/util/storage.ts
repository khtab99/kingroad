export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("admin_token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("admin_token");
  }
  return null;
};

export const deleteToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("admin_token");
  }
};

export const setAdminData = (user: any) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("admin_data", JSON.stringify(user));
  }
};

export const getAdminData = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("admin_data");
  }
  return null;
};

export const deleteAdminData = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("admin_data");
  }
};
