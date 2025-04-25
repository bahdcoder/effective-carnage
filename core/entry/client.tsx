// import './index.css'
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Root } from "../app/root";

hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<StrictMode>
		<Root />
	</StrictMode>,
);
