import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { loginUser } from "@/lib/services/user.service";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const req = { body } as any;

  let result: any;
  const mockRes = {
    status: (code: number) => {
      result = { status: code };
      return mockRes;
    },
    json: (data: any) => {
      result = { status: result?.status || 200, data };
      return mockRes;
    },
    cookie: (name: string, value: string, options: any) => {
      result = { ...result, cookie: { name, value, options } };
      return mockRes;
    },
    clearCookie: (name: string, options: any) => {
      result = { ...result, clearCookie: { name, options } };
      return mockRes;
    },
  } as any;

  await loginUser(req, mockRes);

  const response = NextResponse.json(result.data, { status: result.status });
  if (result.cookie) {
    response.cookies.set(result.cookie.name, result.cookie.value, result.cookie.options);
  }
  return response;
}
