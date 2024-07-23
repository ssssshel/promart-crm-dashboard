import { EXTERNAL_API } from "@/utils/constants/routes";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const userId = params.id;
    const body = await req.json()

    const fetchOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    };

    const externalResponse = await fetch(`${EXTERNAL_API.users}/${userId}/status`, fetchOptions);

    const resData = await externalResponse.json();
    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Error updating user status' }, { status: externalResponse.status });
    }

    return NextResponse.json(resData, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}