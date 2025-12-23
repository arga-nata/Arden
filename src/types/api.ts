// Jalur File: src/types/api.ts

export type Role = 'Admin' | 'Pemantau' | 'Pelaksana'; 
export type Status = 'success' | 'fail';

export interface LoginData {
    token: string;
    name: string;
    role: Role;
    update?: unknown; 
}

export interface ApiResponse<T> {
    code: number;
    status: Status;
    message: string;
    data: T | null;
    error: string | null;
}

export class ApiSuccess<T> implements ApiResponse<T> {
    readonly code: number;
    // Gunakan 'as const' pada string literal (diperbolehkan)
    readonly status = 'success' as const; 
    readonly message: string;
    readonly data: T;
    // Cukup gunakan null (tanpa as const karena null sudah konstan)
    readonly error = null; 

    constructor(message: string, data: T, code: number = 200) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export class ApiFail<T> implements ApiResponse<T> {
    readonly code: number;
    readonly status = 'fail' as const; 
    readonly message: string;
    // Cukup gunakan null di sini
    readonly data = null; 
    readonly error: string;

    constructor(message: string, error: string, code: number = 400) {
        this.code = code;
        this.message = message;
        this.error = error;
    }
}