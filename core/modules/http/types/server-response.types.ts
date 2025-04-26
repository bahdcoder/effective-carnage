export interface ValidationErrors {
	[key: string]: string[];
}

export type ServerResponse = {
	message?: string;
	description?: string;
	errors?: ValidationErrors;
	data?: object | PaginatedResponseData<object>["data"] | null;
	meta?: PaginatedResponseData<object>["meta"];
};

export type PaginatedResponseData<T extends object> = {
	data: T[];
	meta: {
		count: number;
		limit: number;
		offset: number;
		size: number;
	};
};
