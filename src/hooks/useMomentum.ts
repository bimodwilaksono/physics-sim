import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BALL_A_COLOR, BALL_B_COLOR } from "@/lib/constants";

import type {
	BallConfig,
	UseMomentumOptions,
	HistoryPointMomentum,
	BallState,
} from "@/lib/types";

import {
	checkCollision,
	isOutOfBounds,
	resolveCollision,
	calculatePhysics,
} from "@/lib/physics";

import { drawFloor, drawBall } from "@/lib/canvas";

const initialHistory: HistoryPointMomentum = {
	time: 0,
	momentumA: 0,
	momentumB: 0,
	totalMomentum: 0,
	kineticEnergyA: 0,
	kineticEnergyB: 0,
	totalKineticEnergy: 0,
};

/**
 * Hook utama untuk simulasi momentum
 * Mengelola state bola, animasi, dan logika fisika
 * @param options Konfigurasi canvas dan bola awal
 * @returns Object dengan state dan method untuk mengontrol simulasi
 */
export function useMomentum(options: UseMomentumOptions) {
	const {
		canvasWidth,
		canvasHeight,
		initialBallA,
		initialBallB,
		ballAY,
		ballBY,
	} = options;

	// Ref untuk akses canvas langsung
	const canvasRef = useRef<HTMLCanvasElement>(null);
	// State untuk mengontrol animasi dan mode
	const [isRunning, setIsRunning] = useState(false);
	const [isElastic, setIsElastic] = useState(true);
	const [isClient, setIsClient] = useState(false);

	// Inisialisasi posisi bola
	const initialBallAState: BallState = {
		...initialBallA,
		x: canvasWidth * 0.25,
		y: ballAY ?? canvasHeight / 2,
		color: BALL_A_COLOR,
	};

	const initialBallBState: BallState = {
		...initialBallB,
		x: canvasWidth * 0.75,
		y: ballBY ?? canvasHeight / 2,
		color: BALL_B_COLOR,
	};

	// State bola
	const [ballA, setBallA] = useState<BallState>(initialBallAState);
	const [ballB, setBallB] = useState<BallState>(initialBallBState);

	// History untuk chart momentum
	const [history, setHistory] = useState<HistoryPointMomentum[]>([
		initialHistory,
	]);

	// Ref untuk animasi (menghindari stale closure)
	const ballARef = useRef<BallState>(initialBallAState);
	const ballBRef = useRef<BallState>(initialBallBState);
	const frameCountRef = useRef(0);

	// Memoized values untuk data fisika
	const physicsA = useMemo(() => calculatePhysics(ballA), [ballA]);
	const physicsB = useMemo(() => calculatePhysics(ballB), [ballB]);
	const totalMomentum = useMemo(
		() => physicsA.momentum + physicsB.momentum,
		[physicsA.momentum, physicsB.momentum],
	);
	const totalKineticEnergy = useMemo(
		() => physicsA.kineticEnergy + physicsB.kineticEnergy,
		[physicsA.kineticEnergy, physicsB.kineticEnergy],
	);

	/** Memulai animasi jika belum berjalan */
	const start = useCallback(() => {
		if (!isRunning) {
			setIsRunning(true);
		}
	}, [isRunning]);

	/** Menghentikan sementara simulasi */
	const pause = useCallback(() => {
		setIsRunning(false);
	}, []);

	/** Mereset simulasi ke keadaan awal */
	const reset = useCallback(() => {
		setIsRunning(false);
		const newBallA = {
			...initialBallA,
			x: canvasWidth * 0.25,
			y: ballAY ?? canvasHeight / 2,
			color: BALL_A_COLOR,
		};
		const newBallB = {
			...initialBallB,
			x: canvasWidth * 0.75,
			y: ballBY ?? canvasHeight / 2,
			color: BALL_B_COLOR,
		};
		setBallA(newBallA);
		setBallB(newBallB);
		ballARef.current = newBallA;
		ballBRef.current = newBallB;
		setHistory([initialHistory]);
		frameCountRef.current = 0;
	}, [canvasWidth, canvasHeight, initialBallA, initialBallB, ballAY, ballBY]);

	/** Mengganti ke mode elastis (reset posisi bola) */
	const handleToggleElastic = useCallback(() => {
		reset();
		setIsElastic(true);
	}, [reset]);

	/** Mengganti ke mode tidak elastis (reset posisi bola) */
	const handleToggleInElastic = useCallback(() => {
		reset();
		setIsElastic(false);
	}, [reset]);

	/** Update konfigurasi bola A */
	const updateBallA = useCallback((config: Partial<BallConfig>) => {
		setBallA((prev) => {
			const next = { ...prev, ...config };
			ballARef.current = next;
			return next;
		});
	}, []);

	/** Update konfigurasi bola B */
	const updateBallB = useCallback((config: Partial<BallConfig>) => {
		setBallB((prev) => {
			const next = { ...prev, ...config };
			ballBRef.current = next;
			return next;
		});
	}, []);

	/** Fungsi untuk menggambar canvas HTML */
	const draw = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			drawFloor(ctx, canvasWidth, canvasHeight);
			drawBall(ctx, ballA);
			drawBall(ctx, ballB);
		},
		[canvasWidth, canvasHeight, ballA, ballB],
	);

	/** Satu langkah animasi: update posisi dan cek tumbukan */
	const step = useCallback(() => {
		const nextA = {
			...ballARef.current,
			x: ballARef.current.x + ballARef.current.velocity,
		};
		const nextB = {
			...ballBRef.current,
			x: ballBRef.current.x + ballBRef.current.velocity,
		};

		if (checkCollision(nextA, nextB)) {
			resolveCollision(nextA, nextB, isElastic);
		}

		ballARef.current = nextA;
		ballBRef.current = nextB;

		setBallA(nextA);
		setBallB(nextB);

		// Record history every ~60 frames (1 second at 60fps)
		frameCountRef.current += 1;
		if (frameCountRef.current % 10 === 0) {
			const momentumA = nextA.mass * nextA.velocity;
			const momentumB = nextB.mass * nextB.velocity;
			const totalMomentum = momentumA + momentumB;
			const kineticEnergyA = 0.5 * nextA.mass * nextA.velocity ** 2;
			const kineticEnergyB = 0.5 * nextB.mass * nextB.velocity ** 2;
			const totalKineticEnergy = kineticEnergyA + kineticEnergyB;
			const time = frameCountRef.current / 10;

			setHistory((prev) => [
				...prev,
				{
					time,
					momentumA,
					momentumB,
					totalMomentum,
					kineticEnergyA,
					kineticEnergyB,
					totalKineticEnergy,
				},
			]);
		}

		// Auto-stop jika kedua bola sudah keluar canvas
		if (
			isOutOfBounds(nextA, canvasWidth) &&
			isOutOfBounds(nextB, canvasWidth)
		) {
			setIsRunning(false);
		}
	}, [isElastic, canvasWidth]);

	/** Side Effect untuk jalan nya animasi,
	 * tidak akan jalan animasi ketika isRunning bernilai false
	 * */
	useEffect(() => {
		if (!isRunning) return;

		let animationFrameId: number;

		const animate = () => {
			step();
			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [isRunning, step]);

	/** Tandai bahwa komponen sudah di-mount di client */
	useEffect(() => {
		setIsClient(true);
	}, []);

	/** Gambar canvas setelah hydration */
	useEffect(() => {
		if (!isClient) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		draw(ctx);
	}, [draw, isClient]);

	// Return semua state dan method untuk digunakan component/page
	return {
		isRunning,
		isElastic,
		ballA,
		ballB,
		physicsA,
		physicsB,
		totalMomentum,
		totalKineticEnergy,
		history,
		start,
		pause,
		reset,
		setBallA: updateBallA,
		setBallB: updateBallB,
		setIsElastic,
		draw,
		isClient,
		canvasRef,
		handleToggleElastic,
		handleToggleInElastic,
	};
}
