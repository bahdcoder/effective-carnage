export function getEventCoverImage(eventName: string) {
	const name = eventName.toLowerCase();

	if (name.includes("soccer")) {
		return "/covers/soccer.png";
	}

	if (name.includes("formula")) {
		return "/covers/formula-1.png";
	}

	if (name.includes("tennis")) {
		return "/covers/tennis.png";
	}

	if (name.includes("boxing")) {
		return "/covers/boxing.png";
	}

	if (name.includes("basketball")) {
		return "/covers/basketball.png";
	}

	return "/covers/soccer.png";
}
