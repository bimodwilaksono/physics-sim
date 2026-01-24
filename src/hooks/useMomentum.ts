import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface BallConfig {
	mass: number;
	velocity: number;
	radius: number;
}

export interface BallState extends BallConfig {
	x: number;
	y: number;
	color: string;
}

export interface PhysicsData {
	momentum: number;
	kineticEnergy: number;
}

export interface UseMomentumOptions {
	canvasWidth: number;
	canvasHeight: number;
	initialBallA: BallConfig;
	initialBallB: BallConfig;
	ballAY?: number;
	ballBY?: number;
}

const ELASTIC_RESTITUTION = 0.95;
const INELASTIC_RESTITUTION = 0;
const BALL_A_COLOR = "#ff6b6b";
const BALL_B_COLOR = "#4ecdc4";
const FLOOR_OFFSET = 60;

function checkCollision(ball1: BallState, ball2: BallState): boolean {
	const distance = Math.abs(ball2.x - ball1.x);
	const minDistance = ball1.radius + ball2.radius;
	return distance <= minDistance;
}

function resolveCollision(
	ball1: BallState,
	ball2: BallState,
	isElastic: boolean,
): void {
	const m1 = ball1.mass;
	const m2 = ball2.mass;
	const v1 = ball1.velocity;
	const v2 = ball2.velocity;

	const v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
	const v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

	const restitution = isElastic ? ELASTIC_RESTITUTION : INELASTIC_RESTITUTION;

	ball1.velocity = v1Final * restitution;
	ball2.velocity = v2Final * restitution;

	if (!isElastic && restitution < 0.2) {
		const combinedVelocity = (m1 * v1 + m2 * v2) / (m1 + m2);
		ball1.velocity = combinedVelocity;
		ball2.velocity = combinedVelocity;
	}

	const overlap = ball1.radius + ball2.radius - Math.abs(ball2.x - ball1.x);
	if (overlap > 0) {
		ball1.x -= overlap / 2;
		ball2.x += overlap / 2;
	}
}

function calculatePhysics(ball: BallState): PhysicsData {
	const momentum = ball.mass * ball.velocity;
	const kineticEnergy = 0.5 * ball.mass * ball.velocity ** 2;
	return { momentum, kineticEnergy };
}

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

function drawBall(ctx: CanvasRenderingContext2D, ball: BallState): void {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.strokeStyle = "#333";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();

	const arrowLength = ball.velocity * 10;
	if (Math.abs(arrowLength) > 1) {
		ctx.beginPath();
		ctx.moveTo(ball.x, ball.y);
		ctx.lineTo(ball.x + arrowLength, ball.y);
		ctx.strokeStyle = "#e74c3c";
		ctx.lineWidth = 3;
		ctx.stroke();

		const headLen = 10;
		const angle = ball.velocity > 0 ? 0 : Math.PI;
		ctx.beginPath();
		ctx.moveTo(ball.x + arrowLength, ball.y);
		ctx.lineTo(
			ball.x + arrowLength - headLen * Math.cos(angle - Math.PI / 6),
			ball.y - headLen * Math.sin(angle - Math.PI / 6),
		);
		ctx.moveTo(ball.x + arrowLength, ball.y);
		ctx.lineTo(
			ball.x + arrowLength - headLen * Math.cos(angle + Math.PI / 6),
			ball.y + headLen * Math.sin(angle + Math.PI / 6),
		);
		ctx.stroke();
	}

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

export function useMomentum(options: UseMomentumOptions) {
	const {
		canvasWidth,
		canvasHeight,
		initialBallA,
		initialBallB,
		ballAY,
		ballBY,
	} = options;

	const [isRunning, setIsRunning] = useState(false);
	const [isElastic, setIsElastic] = useState(true);

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

	const [ballA, setBallA] = useState<BallState>(initialBallAState);
	const [ballB, setBallB] = useState<BallState>(initialBallBState);

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

	const start = useCallback(() => {
		if (!isRunning) {
			setIsRunning(true);
		}
	}, [isRunning]);

	const pause = useCallback(() => {
		setIsRunning(false);
	}, []);

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

	const updateBallA = useCallback((config: Partial<BallConfig>) => {
		setBallA((prev) => {
			const next = { ...prev, ...config };
			ballARef.current = next;
			return next;
		});
	}, []);

	const updateBallB = useCallback((config: Partial<BallConfig>) => {
		setBallB((prev) => {
			const next = { ...prev, ...config };
			ballBRef.current = next;
			return next;
		});
	}, []);

	const draw = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			drawFloor(ctx, canvasWidth, canvasHeight);
			drawBall(ctx, ballA);
			drawBall(ctx, ballB);
		},
		[canvasWidth, canvasHeight, ballA, ballB],
	);

	const ballARef = useRef<BallState>(initialBallAState);
	const ballBRef = useRef<BallState>(initialBallBState);

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
	}, [isElastic]);

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
	};
}
