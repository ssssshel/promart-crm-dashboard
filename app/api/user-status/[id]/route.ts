import { EXTERNAL_API } from "@/utils/constants/routes";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const userId = params.id

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    let externalResponse;

    externalResponse = await fetch(`${EXTERNAL_API.user_status}/${userId}`, fetchOptions);

    const resData = await externalResponse.json();
    console.log('External service response:', resData);

    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(resData, { status: 200 });

  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
