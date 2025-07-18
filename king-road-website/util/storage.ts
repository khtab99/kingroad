export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
  return null;
};

export const deleteToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("token");
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
export const setPhoneData = (phone: any) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("phone", JSON.stringify(phone));
  }
};

export const getPhoneData = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("phone");
  }
  return null;
};

export const deletePhoneData = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("phone");
  }
};
