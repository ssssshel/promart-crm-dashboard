import { EXTERNAL_API } from "@/utils/constants/routes";
import { NextRequest, NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const payload = await req.json()
    console.log('Payload:', payload);

    // Hacer la solicitud al servicio externo
    const externalResponse = await fetch(EXTERNAL_API.login, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await externalResponse.json();
    console.log('External service login response:', resData);

    if (!externalResponse.ok) {
      return NextResponse.json(resData.error || { message: 'Login failed' }, { status: 400 });
    }

    const accessToken = resData.data.accessToken

    const res = NextResponse.json(resData, { status: 200 })

    const decodedToken = jwt.decode(accessToken);
    const sessionInfo = {
      userId: <number>(<any>decodedToken).user_id,
      roleId: <number>(<any>decodedToken).role_id,
      exp: <number>(<any>decodedToken).exp
    }

    const accessTokenCookie = cookie.serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Usa 'true' en producción
      maxAge: 60 * 15, // La cookie expirará en 15 minutos
      path: '/',
      sameSite: 'lax',
    });

    const sessionInfoCookie = cookie.serialize('sessionInfo', JSON.stringify(sessionInfo), {
      httpOnly: false, // La cookie puede ser accedida desde JavaScript del lado del cliente
      secure: process.env.NODE_ENV === 'production', // Usa 'true' en producción
      maxAge: 60 * 15, // La cookie expirará en 15 minutos
      path: '/',
      sameSite: 'lax',
    });

    res.headers.set('Set-Cookie', [accessTokenCookie, sessionInfoCookie].join(', '));

    return res
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}