import api, {
  clearAccessToken,
  refreshAccessToken,
  setAccessToken,
} from "@/src/services/api";

export const register = async ({ name, email, password }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  const token = response.data?.accessToken;
  if (token) {
    setAccessToken(token);
  }

  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const token = response.data?.accessToken;
  if (token) {
    setAccessToken(token);
  }

  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
};

export const refreshSession = async () => {
  const token = await refreshAccessToken();
  return token;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data?.user || null;
};

export const initializeAuthSession = async () => {
  try {
    await refreshSession();
    const user = await getMe();
    return user;
  } catch (error) {
    clearAccessToken();
    return null;
  }
};
