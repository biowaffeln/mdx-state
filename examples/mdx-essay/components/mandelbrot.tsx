import dynamic from "next/dynamic";

const Shader = dynamic(() => import("./shader").then((m) => m.Shader), {
	ssr: false,
});

const getFragShader = (iter: number) => `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;

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
	st /= pow(2., -1.);
	vec3 color = vec3(mandelbrot(st))*-1. + 1.; 
	gl_FragColor = vec4(color,1.0);
}
`;
export const Mandelbrot = ({ iterations, ...rest }) => {
	return (
		<Shader
			width={400}
			height={400}
			fragShader={getFragShader(iterations)}
			{...rest}
		/>
	);
};
