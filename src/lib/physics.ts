import type { BallState } from "@/lib/types";
import { ELASTIC_RESTITUTION, INELASTIC_RESTITUTION } from "@/lib/constants";

/**
 * Mendeteksi apakah dua bola bersentuhan
 * Menghitung jarak horizontal antara pusat kedua bola
 * @param ball1 Bola pertama
 * @param ball2 Bola kedua
 * @returns true jika jarak <= jumlah radius (bersentuhan)
 */
export function checkCollision(ball1: BallState, ball2: BallState): boolean {
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
export function isOutOfBounds(ball: BallState, width: number): boolean {
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
export function resolveCollision(
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

/**
 * Menghitung momentum bola (p = m × v)
 * @param ball Bola yang akan dihitung
 * @returns Nilai momentum dalam kg·m/s
 */
export function calculateMomentum(ball: BallState): number {
	return ball.mass * ball.velocity;
}

/**
 * Menghitung energi kinetik bola (KE = ½mv²)
 * @param ball Bola yang akan dihitung
 * @returns Nilai energi kinetik dalam Joule
 */
export function calculateKineticEnergy(ball: BallState): number {
	return 0.5 * ball.mass * ball.velocity ** 2;
}

/**
 * Menghitung data fisika lengkap untuk satu bola
 * @param ball Bola yang akan dihitung
 * @returns Object berisi momentum dan energi kinetik
 */
export function calculatePhysics(ball: BallState) {
	const momentum = calculateMomentum(ball);
	const kineticEnergy = calculateKineticEnergy(ball);
	return { momentum, kineticEnergy };
}
