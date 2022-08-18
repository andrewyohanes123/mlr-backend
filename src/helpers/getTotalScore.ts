import { VariableAttributes, VariableInstance } from '../models/Variable';

export const getTotalXScore = (
	variables: VariableInstance[],
	variable: keyof VariableAttributes,
) => {
	return Math.fround(
		variables
			.map(v => {
				return v[variable] as number;
			})
			.reduce((a, b) => a + b, 0),
	);
};

export const getTotalXnYScore = (
	variables: VariableInstance[],
	variable: keyof VariableAttributes,
): number => {
	return Math.fround(
		variables
			.map(v => {
				const { x1, x2, x3, x4 } = v;
				const y = Math.fround((x1 + x2 + x3 + x4) / 4);
				return (v[variable] as number) * y;
			})
			.reduce((a, b) => a + b, 0),
	);
};

export const getTotalXnxnScore = (
	variables: VariableInstance[],
	param1: keyof VariableAttributes,
	param2: keyof VariableAttributes,
) => {
	return Math.fround(
		variables
			.map(v => {
				return (v[param1] as number) * (v[param2] as number);
			})
			.reduce((a, b) => a + b, 0),
	);
};

export const getTotalXnPowScore = (
	variables: VariableInstance[],
	param1: keyof VariableAttributes,
) => {
	return Math.fround(
		variables
			.map(v => {
				return Math.pow(v[param1] as number, 2);
			})
			.reduce((a, b) => a + b, 0),
	);
};
