import dynamic from "next/dynamic";
import { MouseEvent, useEffect, useRef, useState } from "react";

const Shader = dynamic(() => import("./shader").then((m) => m.Shader), {
	ssr: false,
});

const getFragShader = (iter: number) => `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_zoom;
uniform float u_real;
uniform float u_imag;

vec2 square(vec2 number) {
	return vec2(
		number.x*number.x-number.y*number.y,
		2.*number.x*number.y
	);
}

const float maxIter = ${iter}.0;

float mandelbrot(vec2 coord) {
	vec2 z = vec2(0.0, 0.0);
	for( float i = 0.0; i <= maxIter; i+= 1.0 ){
		z = square(z) + coord;
		if(length(z)>2.0) return i/maxIter;
	}
	return maxIter;
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.y;
	st.y -= 0.5;
	st.x -= (0.5 * u_resolution.x / u_resolution.y);
	st /= pow(2., u_zoom);
	st.x += u_real;
	st.y += u_imag;
	vec3 color = vec3(mandelbrot(st))*-1. + 1.; 
	gl_FragColor = vec4(color,1.0);
}
`;

type CanvasMouseEvent = MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>;

const useDrag = (cb: (diff: { dx: number; dy: number }) => void) => {
	const vals = useRef({
		x: null,
		y: null,
		mouseDown: false,
	});

	const onMouseDown = (e: CanvasMouseEvent) => {
		vals.current.mouseDown = true;
		vals.current.x = e.nativeEvent.offsetX;
		vals.current.y = e.nativeEvent.offsetY;
		(e.target as any).style.cursor = "grabbing";
	};

	const onMouseMove = (e: CanvasMouseEvent) => {
		if (!vals.current.mouseDown) return;
		let { offsetX, offsetY } = e.nativeEvent;
		cb({ dx: offsetX - vals.current.x, dy: offsetY - vals.current.y });
		vals.current.x = offsetX;
		vals.current.y = offsetY;
	};

	const onMouseUp = (e: CanvasMouseEvent) => {
		vals.current.x = vals.current.y = null;
		vals.current.mouseDown = false;
		(e.target as any).style.cursor = "grab";
	};

	return { onMouseDown, onMouseMove, onMouseUp };
};

export const MandelbrotInteractive = () => {
	const [zoom, setZoom] = useState(-1.5);
	const [real, setReal] = useState(0);
	const [imag, setImag] = useState(0);
	const [iterations, setIterations] = useState(50);

	const uniforms = {
		u_zoom: zoom,
		u_real: real,
		u_imag: imag,
	};

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const fns = useDrag(({ dx, dy }) => {
		let factor = 2 ** zoom / 2;
		setReal((r) => r - dx / canvasRef.current.width / factor);
		setImag((r) => r + dy / canvasRef.current.width / factor);
	});

	return (
		<div className="mandelbrot">
			<Shader
				className="shader"
				width={800}
				height={450}
				fragShader={getFragShader(iterations)}
				uniforms={uniforms}
				forwardedRef={canvasRef}
				style={{
					cursor: "grab",
				}}
				{...fns}
			/>
			<div className="controls">
				<label>real axis: </label>
				<input
					type="number"
					step="0.01"
					value={uniforms.u_real}
					onChange={(e) => setReal(Number(e.target.value))}
				/>
				<label>imaginary axis:</label>
				<input
					type="number"
					step="0.01"
					value={uniforms.u_imag}
					onChange={(e) => setImag(Number(e.target.value))}
				/>
				<label>zoom</label>
				<input
					type="number"
					step="0.1"
					value={uniforms.u_zoom}
					onChange={(e) => setZoom(Number(e.target.value))}
				/>
				<label>iterations: </label>
				<input
					type="number"
					step="1"
					min="1"
					value={iterations}
					onChange={(e) => setIterations(Number(e.target.value))}
				></input>
			</div>
		</div>
	);
};
