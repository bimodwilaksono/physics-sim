import type { BallState } from "@/lib/types";
import {
	ARROW_COLOR,
	ARROW_HEAD_ANGLE,
	ARROW_HEAD_LENGTH,
	ARROW_LENGTH_MULTIPLIER,
	FLOOR_OFFSET,
	STROKE_COLOR,
	TEXT_COLOR,
	TEXT_FONT,
} from "@/lib/constants";

/**
 * Menggambar garis lantai pada canvas
 * @param ctx Context canvas 2D
 * @param canvasWidth Lebar canvas
 * @param canvasHeight Tinggi canvas
 */
export function drawFloor(
	ctx: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number,
): void {
	ctx.strokeStyle = STROKE_COLOR;
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
export function drawBall(ctx: CanvasRenderingContext2D, ball: BallState): void {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.strokeStyle = STROKE_COLOR;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();

	const arrowLength = ball.velocity * ARROW_LENGTH_MULTIPLIER;
	if (Math.abs(arrowLength) > 1) {
		ctx.beginPath();
		ctx.moveTo(ball.x, ball.y);
		ctx.lineTo(ball.x + arrowLength, ball.y);
		ctx.strokeStyle = ARROW_COLOR;
		ctx.lineWidth = 3;
		ctx.stroke();

		const direction = ball.velocity > 0 ? 1 : -1;

		ctx.beginPath();
		ctx.moveTo(ball.x + arrowLength, ball.y);
		ctx.lineTo(
			ball.x +
				arrowLength -
				direction * ARROW_HEAD_LENGTH * Math.cos(ARROW_HEAD_ANGLE),
			ball.y - ARROW_HEAD_LENGTH * Math.sin(ARROW_HEAD_ANGLE),
		);
		ctx.moveTo(ball.x + arrowLength, ball.y);
		ctx.lineTo(
			ball.x +
				arrowLength -
				direction * ARROW_HEAD_LENGTH * Math.cos(ARROW_HEAD_ANGLE),
			ball.y + ARROW_HEAD_LENGTH * Math.sin(ARROW_HEAD_ANGLE),
		);
		ctx.stroke();
	}

	ctx.fillStyle = TEXT_COLOR;
	ctx.font = TEXT_FONT;
	ctx.textAlign = "center";
	ctx.fillText(`m: ${ball.mass}kg`, ball.x, ball.y - ball.radius - 15);
	ctx.fillText(
		`v: ${ball.velocity.toFixed(1)} m/s`,
		ball.x,
		ball.y - ball.radius - 30,
	);
}
