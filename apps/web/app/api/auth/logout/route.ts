import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/lib/services/user.service";

export async function POST(request: NextRequest) {
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
    clearCookie: (name: string, options: any) => {
      result = { ...result, clearCookie: { name, options } };
      return mockRes;
    },
  } as any;

  logoutUser({} as any, mockRes);

  const response = NextResponse.json(result.data, { status: result.status });
  if (result.clearCookie) {
    response.cookies.set(result.clearCookie.name, "", { ...result.clearCookie.options, maxAge: 0 });
  }
  return response;
}
