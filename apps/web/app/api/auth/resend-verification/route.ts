import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { resendVerification } from "@/lib/services/user.service";

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
  } as any;

  await resendVerification(req, mockRes);

  return NextResponse.json(result.data, { status: result.status });
}
