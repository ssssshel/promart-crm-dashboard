import { EXTERNAL_API } from "@/utils/constants/routes";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const limit = req.nextUrl.searchParams.get('limit');
    const page = req.nextUrl.searchParams.get('page');

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    let externalResponse;

    externalResponse = await fetch(`${EXTERNAL_API.users}?page=${page}&limit=${limit}`, fetchOptions);

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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');

    const payload = await req.json()
    payload.role_id = Number.parseInt(payload.role_id)
    console.log('payload => ', payload)

    const externalResponse = await fetch(`${EXTERNAL_API.users}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken?.value}`
      }
    });

    const resData = await externalResponse.json()
    console.log('External service response:', resData);

    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Request failed' }, { status: 400 });
    }

    return NextResponse.json(resData, { status: 200 });


  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}