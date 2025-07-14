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

export const setUserData = (user: any) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUserData = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("user");
  }
  return null;
};

export const deleteUserData = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("user");
  }
};
