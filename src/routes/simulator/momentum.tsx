import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/pixelact-ui/button";

import "./style.css";
import InfoRow from "@/components/ui/info-row";
import InputRange from "@/components/ui/input-range";
import { Card } from "@/components/ui/pixelact-ui/card";
import { useMomentum } from "@/hooks/useMomentum";

export const Route = createFileRoute("/simulator/momentum")({
	component: RouteComponent,
});

function RouteComponent() {

  const {
    handleToggleElastic,
    handleToggleInElastic,
    canvasRef,
    isClient,
    isElastic,
    ...momentum
	} = useMomentum({
		canvasWidth: 800,
		canvasHeight: 350,
		initialBallA: { mass: 10, velocity: 5, radius: 40 },
		initialBallB: { mass: 15, velocity: -3, radius: 50 },
	});


	if (!isClient) {
		return (
			<Card className="momentum-simulator-container border-none shadow-none">
				<h1 className="text-center text-white drop-shadow-lg">
					Loading
				</h1>
				<div className="game-container">
					<Card className="canvas-container">
						<div className="w-[800px] h-[350px] bg-[#0a0a1a] rounded-lg animate-pulse" />
					</Card>
					<Card className="controls-panel">
						<div className="flex flex-row flex-wrap">
							<div className="h-10 w-20 bg-gray-700 rounded animate-pulse" />
							<div className="h-10 w-20 bg-gray-700 rounded animate-pulse" />
							<div className="h-10 w-20 bg-gray-700 rounded animate-pulse" />
						</div>
					</Card>
				</div>
			</Card>
		);
	}

	return (
		<>
			<Card className="momentum-simulator-container border-none shadow-none bg-transparent">
				<h1 className="text-center text-white drop-shadow-lg">
					Momentum Simulator
				</h1>
				<p className="subtitle text-gray-300">
					Interactive physics simulation of elastic and inelastic collisions
				</p>
			</Card>

			<div className="game-container">
				<Card className="canvas-container">
					<canvas ref={canvasRef} width="800" height="350"></canvas>
				</Card>

				<Card className="controls-panel">
					<div className="control-section">
						<h3>Simulation Controls</h3>

						<div className="mode-select">
							<Button
								className={`mode-btn ${isElastic ? "active" : ""}`}
								onClick={handleToggleElastic}
							>
								Elastic
							</Button>
							<Button
								className={`mode-btn ${!isElastic ? "active" : ""}`}
								onClick={handleToggleInElastic}
							>
								Inelastic
							</Button>
						</div>

						<div className="flex flex-row flex-wrap">
							<Button className="sim-button btn-start" onClick={momentum.start}>
								▶ Start
							</Button>
							<Button className="sim-button btn-pause" onClick={momentum.pause}>
								⏸ Pause
							</Button>
							<Button className="sim-button btn-reset" onClick={momentum.reset}>
								↺ Reset
							</Button>
						</div>
					</div>

					<div className="control-section">
						<h3>🔴 Ball A</h3>
						<div className="ball-control ball-a">
							<InputRange
								label="Mass (kg)"
								min={1}
								max={50}
								value={momentum.ballA.mass}
								unit="kg"
								onChange={(value: number) => momentum.setBallA({ mass: value })}
							/>
							<InputRange
								label="Velocity (m/s)"
								min={-20}
								max={20}
								value={momentum.ballA.velocity}
								unit="m/s"
								onChange={(value: number) =>
									momentum.setBallA({ velocity: value })
								}
							/>
							<InputRange
								label="Radius (px)"
								min={20}
								max={60}
								value={momentum.ballA.radius}
								unit="px"
								onChange={(value: number) =>
									momentum.setBallA({ radius: value })
								}
							/>
						</div>

						<h3>🔵 Ball B</h3>
						<div className="ball-control ball-b">
							<InputRange
								label="Mass (kg)"
								min={1}
								max={50}
								value={momentum.ballB.mass}
								unit="kg"
								onChange={(value: number) => momentum.setBallB({ mass: value })}
							/>
							<InputRange
								label="Velocity (m/s)"
								min={-20}
								max={20}
								value={momentum.ballB.velocity}
								unit="m/s"
								onChange={(value: number) =>
									momentum.setBallB({ velocity: value })
								}
							/>
							<InputRange
								label="Radius (px)"
								min={20}
								max={60}
								value={momentum.ballB.radius}
								unit="px"
								onChange={(value: number) =>
									momentum.setBallB({ radius: value })
								}
							/>
						</div>
					</div>

					<div className="control-section">
						<h3>📊 Live Data</h3>
						<div className="info-panel">
							<InfoRow
								label="Ball A Momentum"
								value={momentum.physicsA.momentum}
								unit="kg·m/s"
								className="ball-a"
							/>
							<InfoRow
								label="Ball B Momentum"
								value={momentum.physicsB.momentum}
								unit="kg·m/s"
								className="ball-b"
							/>
							<InfoRow
								label="Total Momentum"
								value={momentum.totalMomentum}
								unit="kg·m/s"
							/>
							<InfoRow
								label="KE A"
								value={momentum.physicsA.kineticEnergy}
								unit="J"
								className="ball-a"
							/>
							<InfoRow
								label="KE B"
								value={momentum.physicsB.kineticEnergy}
								unit="J"
								className="ball-b"
							/>
							<InfoRow
								label="Total KE"
								value={momentum.totalKineticEnergy}
								unit="J"
							/>
						</div>

						<div className="formula">
							p = m × v &nbsp;&nbsp;|&nbsp;&nbsp; KE = ½mv²
						</div>
					</div>
				</Card>
			</div>
		</>
	);
}
