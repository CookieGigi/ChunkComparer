import { createContext, type ReactNode, useContext, useState } from "react";
import type { Settings } from "../types/Settings";

interface SettingsContextType {
	settings: Settings;
	updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export const SettingsProvider: React.FC<{
	initialSettings: Settings;
	children: ReactNode;
}> = ({ initialSettings, children }) => {
	const [settings, setSettings] = useState<Settings>(initialSettings);

	const updateSettings = (newSettings: Partial<Settings>) => {
		console.log(newSettings);
		setSettings((prevSettings) => ({
			...prevSettings,
			...newSettings,
		}));
	};

	return (
		<SettingsContext.Provider value={{ settings, updateSettings }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = (): SettingsContextType => {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
