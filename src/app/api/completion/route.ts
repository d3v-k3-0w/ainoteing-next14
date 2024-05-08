// /api/completion

import { NextResponse } from 'next/server';

import { generateCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
	const body = await req.json();
	const { prompt } = body;

	if (!prompt) {
		return new NextResponse('Falta el prompt en el cuerpo de la solicitud', {
			status: 400,
		});
	}

	try {
		const completion = await generateCompletion(prompt);

		return new NextResponse(JSON.stringify({ completion }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.error('Error generando la respuesta:', err);

		return new NextResponse('Error generando la respuesta', {
			status: 500,
		});
	}
}
