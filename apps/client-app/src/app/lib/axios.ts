import axiosStatic, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_URL } from "@/app/lib/constants";
import { useModalStore } from "../shared/components/modal/use-modal.store";

let axiosInstance: AxiosInstance | null = null;

function createAxiosInstance(): AxiosInstance {
  const instance = axiosStatic.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.response.use(handleSuccess, handleError);

  return instance;
}

function handleSuccess(response: AxiosResponse) {
  const url = response.config.url;
  if (url?.includes("/session") && response.data?.csrfToken) {
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
  const url = error.config?.url ?? "";
  if (!response) {
    return Promise.reject({
      status: 500,
      message: "Internal server error",
      error: "Internal server error",
    });
  }

  const is401 = response.status === 401;
  const shouldIgnore = ["/auth/login", "/auth/register", "/session"].some(p =>
    url.includes(p)
  );

  if (is401 && !shouldIgnore) {
    const { openModal } = useModalStore.getState();
    openModal({
      title: "Session expired",
      type: "session-expired",
      content: "Your session has expired. Please login again.",
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
