// inspired by https://github.com/signal-noise/react-shader-canvas
import React, { useEffect, useRef } from "react";
import GLSLCanvas from "glslCanvas";

// see uniform parser for reference:
// https://github.com/patriciogonzalezvivo/glslCanvas/blob/master/src/gl/gl.js#L182

type Uniform =
	| number
	| number[]
	| number[][]
	| string
	| string[]
	| boolean
	| Uniforms
	| Uniforms[];

type Uniforms = { [key: string]: Uniform };

type Props = {
	fragShader: string;
	vertShader?: string;
	uniforms?: Uniforms;
};

export const Shader: React.FC<Props & React.HTMLProps<HTMLCanvasElement>> = ({
	fragShader,
	vertShader,
	uniforms,
	...rest
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sandboxRef = useRef(null);

	useEffect(() => {
		sandboxRef.current = new GLSLCanvas(canvasRef.current);
	}, []);

	useEffect(() => {
		sandboxRef.current.load(fragShader, vertShader);
		sandboxRef.current.refreshUniforms();
		sandboxRef.current.setUniforms(uniforms);
	}, [fragShader, vertShader]);

	useEffect(() => {
		sandboxRef.current.setUniforms(uniforms);
	}, [uniforms]);

	return <canvas ref={canvasRef} {...rest} />;
};
