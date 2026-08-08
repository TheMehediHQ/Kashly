import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { verifyUser } from "@/lib/services/user.service";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const req = { query: { token } } as any;

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

  await verifyUser(req, mockRes);

  return NextResponse.json(result.data, { status: result.status });
}
