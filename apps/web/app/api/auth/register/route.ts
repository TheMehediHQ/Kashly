import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { registerUser } from "@/lib/services/user.service";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const req = { body } as any;
  const res = {
    status: (code: number) => {
      const response = NextResponse.json({}, { status: code });
      return {
        json: (data: any) => NextResponse.json(data, { status: code }),
        cookie: () => response,
        clearCookie: () => response,
      };
    },
  } as any;

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
    cookie: () => mockRes,
    clearCookie: () => mockRes,
  } as any;

  await registerUser(req, mockRes);

  return NextResponse.json(result.data, { status: result.status });
}
