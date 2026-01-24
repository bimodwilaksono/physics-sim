import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface MomentumChartData {
	time: number;
	momentumA: number;
	momentumB: number;
	totalMomentum: number;
	kineticEnergyA: number;
	kineticEnergyB: number;
	totalKineticEnergy: number;
}

interface MomentumChartProps {
	data: MomentumChartData[];
}

const renderCustomLegend = (props: {
	payload?: ReadonlyArray<{ color?: string; value?: string }>;
}) => {
	const { payload } = props;

	if (!payload) return null;

	return (
		<ul style={{ listStyle: "none", padding: "8px 0", margin: 0 }}>
			{payload.map((entry, index) => (
				<li
					// biome-ignore lint/suspicious/noArrayIndexKey: Legend items are stable and order is fixed
					key={`item-${index}`}
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "4px",
					}}
				>
					<div
						style={{
							width: "20px",
							height: "3px",
							backgroundColor: entry.color ?? "#888",
							marginRight: "8px",
						}}
					/>
					<span style={{ color: "#ccc", fontSize: "12px" }}>
						{entry.value ?? ""}
					</span>
				</li>
			))}
		</ul>
	);
};

export function MomentumChart({ data }: MomentumChartProps) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 60,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" stroke="#444" />
				<XAxis
					dataKey="time"
					label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
					tick={{ fill: "#ccc" }}
					stroke="#888"
				/>
				<YAxis
					yAxisId="momentum"
					label={{
						value: "Momentum (kg·m/s)",
						angle: -90,
						position: "insideStart",
						offset: -5,
					}}
					tick={{ fill: "#ff6b6b" }}
					stroke="#ff6b6b"
				/>
				<YAxis
					yAxisId="energy"
					orientation="right"
					label={{
						value: "Kinetic Energy (J)",
						angle: 90,
						position: "insideEnd",
						offset: -5,
					}}
					tick={{ fill: "#4ecdc4" }}
					stroke="#4ecdc4"
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "#1a1a2e",
						border: "1px solid #444",
						borderRadius: "8px",
					}}
					labelStyle={{ color: "#fff" }}
				/>
				<Legend
					content={renderCustomLegend}
					layout="vertical"
					align="right"
					verticalAlign="top"
					width={140}
				/>
				<Line
					yAxisId="momentum"
					type="monotone"
					dataKey="momentumA"
					name="Ball A Momentum"
					stroke="#ff4444"
					strokeWidth={2}
					dot={false}
				/>
				<Line
					yAxisId="momentum"
					type="monotone"
					dataKey="momentumB"
					name="Ball B Momentum"
					stroke="#4444ff"
					strokeWidth={2}
					dot={false}
				/>
				<Line
					yAxisId="momentum"
					type="monotone"
					dataKey="totalMomentum"
					name="Total Momentum"
					stroke="#44ff44"
					strokeWidth={2}
					dot={false}
					strokeDasharray="5 5"
				/>
				<Line
					yAxisId="energy"
					type="monotone"
					dataKey="kineticEnergyA"
					name="Ball A KE"
					stroke="#ff9f43"
					strokeWidth={2}
					dot={false}
				/>
				<Line
					yAxisId="energy"
					type="monotone"
					dataKey="kineticEnergyB"
					name="Ball B KE"
					stroke="#00d2d3"
					strokeWidth={2}
					dot={false}
				/>
				<Line
					yAxisId="energy"
					type="monotone"
					dataKey="totalKineticEnergy"
					name="Total KE"
					stroke="#a29bfe"
					strokeWidth={2}
					dot={false}
					strokeDasharray="5 5"
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
