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

    externalResponse = await fetch(`${EXTERNAL_API.users}/${userId}`, fetchOptions);

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

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const userId = params.id;

    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const externalResponse = await fetch(`${EXTERNAL_API.users}/${userId}`, fetchOptions);

    const resData = await externalResponse.json();
    console.log('External service response:', resData);
    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Error deleting user' }, { status: externalResponse.status });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const userId = params.id;
    const body = await req.json()

    body.role_id = Number.parseInt(body.role_id)

    const fetchOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    };

    const externalResponse = await fetch(`${EXTERNAL_API.users}/${userId}`, fetchOptions);

    const resData = await externalResponse.json();
    console.log('External service response:', resData);
    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Error updating user' }, { status: externalResponse.status });
    }

    return NextResponse.json(resData, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
