/** Konfigurasi bola: massa, kecepatan, dan radius */
export interface BallConfig {
	mass: number;
	velocity: number;
	radius: number;
}

/** State lengkap bola termasuk posisi dan warna */
export interface BallState extends BallConfig {
	x: number;
	y: number;
	color: string;
}

/** Data fisika: momentum dan energi kinetik */
export interface PhysicsData {
	momentum: number;
	kineticEnergy: number;
}

/** Param untuk hooks useMomentum */
export interface UseMomentumOptions {
	canvasWidth: number;
	canvasHeight: number;
	initialBallA: BallConfig;
	initialBallB: BallConfig;
	ballAY?: number;
	ballBY?: number;
}

// Data Point for momentum and energy history
export type HistoryPointMomentum = {
	time: number;
	momentumA: number;
	momentumB: number;
	totalMomentum: number;
	kineticEnergyA: number;
	kineticEnergyB: number;
	totalKineticEnergy: number;
};
