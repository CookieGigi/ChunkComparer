const defaultZoom = 1;
const defaultZoomIncrement = 0.1;

export class Settings {
	zoomValue: number;
	zoomIncrement: number;

	constructor(zoom: number, zoomIncrement: number) {
		this.zoomValue = zoom;
		this.zoomIncrement = zoomIncrement;
	}

	public static zoom(s: Settings): Settings {
		return { ...s, zoomValue: Math.min(s.zoomValue + s.zoomIncrement, 4) };
	}

	public static unzoom(s: Settings): Settings {
		return {
			...s,
			zoomValue: Math.max(s.zoomValue - s.zoomIncrement, s.zoomIncrement),
		};
	}

	public static resetZoom(s: Settings): Settings {
		return { ...s, zoomValue: defaultZoom };
	}
}

export const defaultSettings = new Settings(defaultZoom, defaultZoomIncrement);
