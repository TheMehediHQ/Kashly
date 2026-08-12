import { z } from "zod";
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const registerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    fullName?: string;
    password?: string;
}, {
    email?: string;
    fullName?: string;
    password?: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const transactionSchema: z.ZodObject<{
    amount: z.ZodNumber;
    category: z.ZodString;
    method: z.ZodString;
    date: z.ZodString;
    time: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    attachment: z.ZodOptional<z.ZodString>;
    transactionType: z.ZodEnum<["income", "expense"]>;
}, "strip", z.ZodTypeAny, {
    date?: string;
    time?: string;
    amount?: number;
    category?: string;
    method?: string;
    note?: string;
    attachment?: string;
    transactionType?: "income" | "expense";
}, {
    date?: string;
    time?: string;
    amount?: number;
    category?: string;
    method?: string;
    note?: string;
    attachment?: string;
    transactionType?: "income" | "expense";
}>;
export declare const budgetSchema: z.ZodObject<{
    category: z.ZodString;
    limit: z.ZodNumber;
    month: z.ZodNumber;
    year: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category?: string;
    note?: string;
    limit?: number;
    month?: number;
    year?: number;
}, {
    category?: string;
    note?: string;
    limit?: number;
    month?: number;
    year?: number;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token?: string;
    newPassword?: string;
}, {
    token?: string;
    newPassword?: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    fullName: z.ZodString;
    photoURL: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fullName?: string;
    photoURL?: string;
}, {
    fullName?: string;
    photoURL?: string;
}>;
export declare const updatePasswordSchema: z.ZodObject<{
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword?: string;
    oldPassword?: string;
}, {
    newPassword?: string;
    oldPassword?: string;
}>;
export declare const creditsSchema: z.ZodObject<{
    credits: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    credits?: number;
}, {
    credits?: number;
}>;
export declare const transactionStatusSchema: z.ZodObject<{
    isTransactionAllowed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isTransactionAllowed?: boolean;
}, {
    isTransactionAllowed?: boolean;
}>;
//# sourceMappingURL=index.d.ts.map