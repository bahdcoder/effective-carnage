import Axios, { type AxiosInstance } from "axios"
import * as RadixContext from "@radix-ui/react-context"

export const apiClient = Axios.create({
	baseURL: "/api/v1",
})

export interface ApiClientState {
	apiClient: AxiosInstance
}

export const [ApiClientProvider, useApiClientContext] =
	RadixContext.createContext<ApiClientState>("ApiClientContext")

export function useApiClient() {
	return useApiClientContext("useApiClient")
}
