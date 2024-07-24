import { EXTERNAL_API } from "@/utils/constants/routes";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { STATUS_CODES } from "@/utils/constants/global";

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const userId = params.id;
    const body = await req.json()


    console.log('body => ', body)
    const payload = {
      user_id: body.user_id,
      status_id: STATUS_CODES[body.status_id]
    }
    console.log('body => ', payload)

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    };

    const externalResponse = await fetch(`${EXTERNAL_API.users}/${userId}/status`, fetchOptions);

    const resData = await externalResponse.json();
    console.log('External service login response:', resData);
    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Error updating user status' }, { status: externalResponse.status });
    }

    return NextResponse.json(resData, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}