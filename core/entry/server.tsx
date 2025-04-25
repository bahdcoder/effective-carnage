import { StrictMode } from "react";
import {
	type RenderToPipeableStreamOptions,
	renderToPipeableStream,
} from "react-dom/server";
import { Root } from "../app/root";

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
	return renderToPipeableStream(
		<StrictMode>
			<Root />
		</StrictMode>,
		options,
	);
}
