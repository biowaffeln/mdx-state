import { MouseEvent, useEffect, useRef } from "react";
import { InlineMath } from "react-katex";

export const ComplexNumber = ({ re, im }) => (
	<InlineMath math={`${re.toFixed(2)}${im > 0 ? "+" : ""}${im.toFixed(2)}i`} />
);

export const Complex2D = ({ x, y, onChange, ...rest }) => {
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
		ctx.beginPath();
		ctx.moveTo(x * factor, y * -factor);
		ctx.arc(x * factor, y * -factor, 3, 0, 2 * Math.PI);
		ctx.fillStyle = ctx.strokeStyle = "red";
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}, [x, y]);

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
			className="shadow w-1/2"
			width="400"
			height="400"
			onMouseMove={handleMouseMove}
			{...rest}
		></canvas>
	);
};
