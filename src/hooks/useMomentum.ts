import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

/** Konstanta fisika dan tampilan */
const ELASTIC_RESTITUTION = 0.95; // Koefisien restitusi untuk tumbukan elastis
const INELASTIC_RESTITUTION = 0; // Koefisien restitusi untuk tumbukan tidak elastis
const BALL_A_COLOR = "#ff6b6b"; // Warna bola A (merah)
const BALL_B_COLOR = "#4ecdc4"; // Warna bola B (cyan)
const FLOOR_OFFSET = 60; // Jarak garis lantai dari tengah canvas

/**
 * Mendeteksi apakah dua bola bersentuhan
 * Menghitung jarak horizontal antara pusat kedua bola
 * @param ball1 Bola pertama
 * @param ball2 Bola kedua
 * @returns true jika jarak <= jumlah radius (bersentuhan)
 */
function checkCollision(ball1: BallState, ball2: BallState): boolean {
	const distance = Math.abs(ball2.x - ball1.x);
	const minDistance = ball1.radius + ball2.radius;
	return distance <= minDistance;
}

/**
 * Mengecek apakah bola sudah keluar dari area canvas
 * @param ball Bola yang akan dicek
 * @param width Lebar canvas
 * @returns true jika bola keluar dari batas kiri/kanan
 */
function isOutOfBounds(ball: BallState, width: number): boolean {
	return ball.x < -ball.radius || ball.x > width + ball.radius;
}

/**
 * Menghitung kecepatan baru setelah tumbukan menggunakan hukum konservasi momentum
 * Untuk tumbukan elastis: menggunakan rumus standard
 * Untuk tumbukan tidak elastis: bola menyatu dengan kecepatan rata-rata
 * @param ball1 Bola pertama (velocity akan diubah)
 * @param ball2 Bola kedua (velocity akan diubah)
 * @param isElastic true untuk elastis, false untuk tidak elastis
 */
function resolveCollision(
	ball1: BallState,
	ball2: BallState,
	isElastic: boolean,
): void {
	const m1 = ball1.mass;
	const m2 = ball2.mass;
	const v1 = ball1.velocity;
	const v2 = ball2.velocity;

	// Rumus kecepatan akhir untuk tumbukan 1D
	const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
	const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

	// Terapkan koefisien restitusi
	const restitution = isElastic ? ELASTIC_RESTITUTION : INELASTIC_RESTITUTION;

	ball1.velocity = v1Final * restitution;
	ball2.velocity = v2Final * restitution;

	// Untuk tumbukan tidak elastis sempurna, bola menyatu
	if (!isElastic && restitution < 0.2) {
		const combinedVelocity = (m1 * v1 + m2 * v2) / (m1 + m2);
		ball1.velocity = combinedVelocity;
		ball2.velocity = combinedVelocity;
	}

	// Pisahkan bola yang overlap agar tidak stuck
	const overlap = ball1.radius + ball2.radius - Math.abs(ball2.x - ball1.x);
	if (overlap > 0) {
		ball1.x -= overlap / 2;
		ball2.x += overlap / 2;
	}
}

/**
 * Menghitung data fisika untuk satu bola
 * @param ball Bola yang akan dihitung
 * @returns Object berisi momentum (p=mv) dan energi kinetik (KE=½mv²)
 */
function calculatePhysics(ball: BallState): PhysicsData {
	const momentum = ball.mass * ball.velocity;
	const kineticEnergy = 0.5 * ball.mass * ball.velocity ** 2;
	return { momentum, kineticEnergy };
}

/**
 * Menggambar garis lantai pada canvas
 * @param ctx Context canvas 2D
 * @param canvasWidth Lebar canvas
 * @param canvasHeight Tinggi canvas
 */
function drawFloor(
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number,
): void {
	ctx.strokeStyle = "#333";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(50, canvasHeight / 2 + FLOOR_OFFSET);
	ctx.lineTo(canvasWidth - 50, canvasHeight / 2 + FLOOR_OFFSET);
	ctx.stroke();
}

/**
 * Menggambar bola dengan panah kecepatan dan label
 * @param ctx Context canvas 2D
 * @param ball Bola yang akan digambar
 */
function drawBall(ctx: CanvasRenderingContext2D, ball: BallState): void {
	// Gambar lingkaran bola
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.strokeStyle = "#333";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();

	// Gambar panah kecepatan
	const arrowLength = ball.velocity * 10;
	if (Math.abs(arrowLength) > 1) {
		ctx.beginPath();
		ctx.moveTo(ball.x, ball.y);
		ctx.lineTo(ball.x + arrowLength, ball.y);
		ctx.strokeStyle = "#e74c3c";
		ctx.lineWidth = 3;
		ctx.stroke();

		// Kepala panah
		const headLen = 10;
		const direction = ball.velocity > 0 ? 1 : -1;
		const baseAngle = Math.PI / 6; // 30° dari garis utama

		ctx.beginPath();
		// Garis pertama kepala panah
		ctx.moveTo(ball.x + arrowLength, ball.y);
		ctx.lineTo(
			ball.x + arrowLength - direction * headLen * Math.cos(baseAngle),
			ball.y - headLen * Math.sin(baseAngle),
		);
		// Garis kedua kepala panah
		ctx.moveTo(ball.x + arrowLength, ball.y);
		ctx.lineTo(
			ball.x + arrowLength - direction * headLen * Math.cos(baseAngle),
			ball.y + headLen * Math.sin(baseAngle),
		);
		ctx.stroke();
	}

	// Tampilkan label massa dan kecepatan
	ctx.fillStyle = "#fff";
	ctx.font = "14px Arial";
	ctx.textAlign = "center";
	ctx.fillText(`m: ${ball.mass}kg`, ball.x, ball.y - ball.radius - 15);
	ctx.fillText(
		`v: ${ball.velocity.toFixed(1)} m/s`,
		ball.x,
		ball.y - ball.radius - 30,
	);
}

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

	// Ref untuk animasi (menghindari stale closure)
	const ballARef = useRef<BallState>(initialBallAState);
	const ballBRef = useRef<BallState>(initialBallBState);

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
