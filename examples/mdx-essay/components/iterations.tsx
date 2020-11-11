import { MouseEvent, useEffect, useRef } from "react";
import { InlineMath } from "react-katex";

type Complex = [number, number];

const square = ([a, b]: Complex): Complex => [a * a - b * b, 2 * a * b];

const add = ([a1, b1]: Complex, [a2, b2]: Complex): Complex => [
	a1 + a2,
	b1 + b2,
];

const iterate = (c: Complex, n: number): Complex[] => {
	const res: Complex[] = [c];

	for (let i = 0; i < n; i++) {
		const next = add(square(res.slice(-1)[0]), c);
		res.push(next);
	}

	return res;
};
const tooLarge = ([x, y]: Complex) =>
	x > 100_000_000 ||
	y > 100_000_000 ||
	x < -100_000_000 ||
	y < -100_000_000 ||
	isNaN(x) ||
	isNaN(y);

export const Iterate2D = ({
	x,
	y,
	iterations,
	lineColor = "black",
	lineWidth = 1,
	onChange,
	...rest
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const factor = canvas.width / 2;
		// clear
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// start drawing
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);

		ctx.translate(0.5, 0.5);

		// draw coordinate lines
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 0.1;
		let step = 0.2;
		for (let i = -1; i < 1; i += step) {
			ctx.moveTo(1 * factor, i * factor);
			ctx.lineTo(-1 * factor, i * factor);
			ctx.moveTo(i * factor, 1 * factor);
			ctx.lineTo(i * factor, -1 * factor);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 0.4;
		ctx.moveTo(1 * factor, 0);
		ctx.lineTo(-1 * factor, 0);
		ctx.moveTo(0, 1 * factor);
		ctx.lineTo(0, -1 * factor);
		ctx.stroke();
		ctx.restore();

		// draw dot
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x * factor, y * -factor);
		ctx.arc(x * factor, y * -factor, 3, 0, 2 * Math.PI);
		ctx.fillStyle = ctx.strokeStyle = "red";
		ctx.stroke();
		ctx.fill();
		ctx.restore();

		// draw iterations
		ctx.beginPath();
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = lineWidth;
		const nums = iterate([x, y], iterations);
		ctx.moveTo(x * factor, y * -factor);
		for (let i = 1; i < iterations; i++) {
			const [x, y] = nums[i];
			if (tooLarge([x, y])) break;
			ctx.lineTo(x * factor, y * -factor);
		}
		ctx.stroke();
		ctx.restore();
	}, [x, y, iterations, lineColor, lineWidth]);

	const handleMouseMove = (
		e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
	) => {
		if (!(e.buttons & 1)) return; // mouse not down
		const {
			left,
			right,
			top,
			bottom,
		} = canvasRef.current.getBoundingClientRect();
		let x = ((e.clientX - left) / (right - left) - 0.5) * 2;
		let y = ((e.clientY - bottom) / (top - bottom) - 0.5) * 2;
		onChange({ x, y });
	};

	return (
		<canvas
			ref={canvasRef}
			width="400"
			height="400"
			onMouseMove={handleMouseMove}
			{...rest}
		></canvas>
	);
};
