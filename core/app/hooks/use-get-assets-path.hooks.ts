import { useSession } from "@/app/state/session-state"

export function useGetAssetsPath() {
	const { isProd } = useSession()

	return function getAssetsPath(file: string) {
		return isProd
			? `/assets/${file.startsWith("/") ? file?.slice(1) : file}`
			: file
	}
}
