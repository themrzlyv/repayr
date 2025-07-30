import axiosStatic, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_URL } from "@/app/lib/constants";
import { useModalStore } from "../shared/components/modal/use-modal.store";
import { useAuthStore } from "../modules/auth/interface/stores/use-auth.store";

let axiosInstance: AxiosInstance | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

function createAxiosInstance(): AxiosInstance {
  const instance = axiosStatic.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - add access token for each request
  instance.interceptors.request.use(config => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(handleSuccess, handleError);

  return instance;
}

function handleSuccess(response: AxiosResponse) {
  const url = response.config.url;
  if (url?.includes("/auth/refresh") && response.data?.csrfToken) {
    axiosInstance!.defaults.headers.common["x-csrf-token"] =
      response.data.csrfToken;
  }
  if (url?.includes("/auth/logout")) {
    delete axiosInstance!.defaults.headers.common["x-csrf-token"];
  }
  return response;
}

async function handleError(error: AxiosError) {
  const response = error.response;
  const originalRequest = error.config!;
  const url = originalRequest.url ?? "";

  if (!response) {
    return Promise.reject({
      status: 500,
      message: "Internal server error",
      error: "Internal server error",
    });
  }

  const is401 = response.status === 401;
  const shouldIgnore = ["/auth/login", "/auth/register", "/auth/refresh"].some(
    p => url.includes(p)
  );

  // Eğer 401 ise ve login/refresh değilse
  if (is401 && !shouldIgnore) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        // Refresh token isteği
        const refreshResponse = await axiosStatic.get<{ accessToken: string }>(
          `${API_URL}/auth/refresh`,
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.accessToken;
        const { setAcessToken } = useAuthStore.getState();
        setAcessToken({ accessToken: newToken });

        // Axios instance default Authorization header güncelle
        axiosInstance!.defaults.headers.common["Authorization"] =
          `Bearer ${newToken}`;

        // Bekleyen istekleri tetikle
        onRefreshed(newToken);
        isRefreshing = false;

        // Orijinal isteği yeniden dene
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance!.request(originalRequest);
      } catch (refreshError: any) {
        isRefreshing = false;

        // Refresh de 401 dönerse
        if (refreshError.response?.status === 401) {
          const { openModal } = useModalStore.getState();
          openModal({
            title: "Session expired",
            type: "session-expired",
            content: "Your session has expired. Please login again.",
          });
        }
        return Promise.reject(refreshError);
      }
    }

    // Eğer refresh devam ediyorsa diğer istekler refresh bitince bekler
    return new Promise(resolve => {
      subscribeTokenRefresh((token: string) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(axiosInstance!.request(originalRequest));
      });
    });
  }

  return Promise.reject(response.data);
}

export function getAxios(): AxiosInstance {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstance();
  }
  return axiosInstance;
}
