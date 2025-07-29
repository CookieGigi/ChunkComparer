import { useEffect, useState } from "react";
import { type ChunkerConfig, configs } from "../provider/providerConfig";

export default function ChunkerSelector({
	setChunkerConfigs,
}: {
	setChunkerConfigs: React.Dispatch<
		React.SetStateAction<{ [key: string]: ChunkerConfig } | undefined>
	>;
}) {
	const configList = Object.entries(configs).map(([id, _value]) => ({
		id: id,
		checked: false,
	}));
	const [configsCheck, setConfigCheck] =
		useState<{ id: string; checked: boolean }[]>(configList);

	const handleChange = (id: string) => {
		setConfigCheck((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, checked: !item.checked } : item,
			),
		);
	};

	useEffect(() => {
		const res: { [key: string]: ChunkerConfig } = {};
		for (const item of configsCheck) {
			if (item.checked) {
				res[item.id] = configs[item.id];
			}
		}
		setChunkerConfigs(res);
	}, [configsCheck, setChunkerConfigs]);

	return (
		<div>
			{configsCheck.map((config) => (
				<div key={config.id}>
					<label htmlFor={config.id}>{config.id}</label>
					<input
						id={config.id}
						type="checkbox"
						checked={config.checked}
						onChange={() => handleChange(config.id)}
					/>
				</div>
			))}
		</div>
	);
}
