import { State } from "./state";
import * as React from "react";
import { ChangeEvent, HTMLAttributes, useEffect, useState } from "react";

// ---  useObserve Hook  --- //

export const useObserve = <T,>(state: State<T>) => {
	const [value, setValue] = useState<T>({ ...state });

	useEffect(() => {
		const handleChange = (e: any) => setValue(e.detail);
		state.addEventListener("change", handleChange);
		return () => state.removeEventListener("change", handleChange);
	}, []);

	return value;
};

type StateProps<T> = {
	state: State<T>;
	children: (obj: T) => any;
};

// ---  Observe Component  --- //

export const Observe = <T,>({ state, children }: StateProps<T>) => {
	const value = useObserve(state);
	return <>{children(value)}</>;
};

// ---  Input Component  --- //

type InputProps<T extends object> = {
	state: State<T>;
	name: keyof T;
} & HTMLAttributes<HTMLInputElement>;

type Value = number | string | boolean;

export const Input = <T extends Record<string | number, Value>>({
	state,
	name,
	...rest
}: InputProps<T>) => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		let inputValue: Value;
		// handle boolean values
		if (["checkbox", "radio"].includes(target.type)) {
			inputValue = target.checked;
		}
		// handle numbers
		else if (typeof state[name] === "number") {
			inputValue = Number(target.value);
		}
		// handle strings
		else {
			inputValue = target.value;
		}
		// apparently you gotta use "any" here ¯\_(ツ)_/¯
		// https://github.com/microsoft/TypeScript/issues/34591
		state[name] = inputValue as any;
	};

	return (
		<Observe state={state}>
			{(obj) => (
				<input value={obj[name] as any} onChange={onChange} {...rest} />
			)}
		</Observe>
	);
};
