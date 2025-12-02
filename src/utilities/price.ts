export function formatToCLP(value: number): string {
	return `$ ${Math.round(value).toLocaleString("es-CL")}`;
}