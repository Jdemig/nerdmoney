import { NextApiResponse } from "next/types";



export class StdError extends Error {
    status: boolean;
    code?: string;
    details?: { [key: string]: string; }

    constructor(message: string) {
        super(message);
        this.name = 'StdError';
        this.status = false;
    }
}
export type StdErrorInput = { message: string; code?: string; details?: { [key: string]: string; } };
export type ErrorInput = string | StdError | StdErrorInput;


type ResponseObject = {
	[key: string]: any;
}
type SuccessInput = string | ResponseObject;


export type StdSuccess = {
	status: boolean;
	value: SuccessInput;
}


export function isStdError(obj: any): obj is StdError {
    return (obj as StdError).name === 'StdError';
}


export function isStdSuccess(obj: any): obj is StdSuccess {
    return (obj as StdSuccess).value !== undefined && (obj as StdSuccess).status !== undefined;
}


export function createStdError(errorInput: ErrorInput): StdError {
	let err;
	if (typeof errorInput === 'string') {
        err = new StdError(errorInput);
	} else if (errorInput instanceof StdError) {
        err = errorInput;
    } else {
        err = new StdError(errorInput.message);
        err.code = errorInput.code;
        err.details = errorInput.details;
	}

	return err;
}


// standardize the response format
export function sendStdError(res: NextApiResponse, errorInput: ErrorInput | StdError) {
    const err: StdError = isStdError(errorInput) ? errorInput : createStdError(errorInput);

    const errString = JSON.stringify(err, Object.getOwnPropertyNames(err));

	res.status(400).send(errString);
}


export function stdSuccess(successInput: SuccessInput): StdSuccess {
	return {
		status: true,
		value: successInput,
	}
}


export function sendStdSuccess(res: NextApiResponse, successInput: SuccessInput) {
	const success: StdSuccess = isStdSuccess(successInput) ? successInput : stdSuccess(successInput);

	res.status(200).json(success);
}
