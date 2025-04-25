export type PaginatedResponseData<T extends object> = {
	data: T[];
	meta: {
		count: number;
		limit: number;
		offset: number;
		size: number;
	};
};

export function getPaginationResponseData<T = unknown>(
	data: T[],
	count: number,
	limit: number,
	offset: number,
) {
	return {
		data,
		meta: {
			count,
			limit,
			offset,
			size: data.length,
		},
	};
}
