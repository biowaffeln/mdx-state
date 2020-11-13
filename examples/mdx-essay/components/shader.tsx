// inspired by https://github.com/signal-noise/react-shader-canvas
import {
	FC,
	forwardRef,
	HTMLProps,
	MutableRefObject,
	useEffect,
	useRef,
} from "react";
import GLSLCanvas from "glslCanvas";
import mergeRefs from "react-merge-refs";

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

type ShaderProps = {
	fragShader: string;
	vertShader?: string;
	uniforms?: Uniforms;
	forwardedRef?: MutableRefObject<HTMLCanvasElement>;
} & HTMLProps<HTMLCanvasElement>;

export const Shader: FC<ShaderProps> = ({
	fragShader,
	vertShader,
	uniforms,
	forwardedRef,
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

	return <canvas {...rest} ref={mergeRefs([forwardedRef, canvasRef])} />;
};
