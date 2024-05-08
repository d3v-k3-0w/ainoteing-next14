//++ /api/createNoteBook
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { generateDescription } from '@/lib/gemini';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
	const { userId } = auth();

	if (!userId) {
		return new NextResponse('No autorizado', { status: 401 });
	}

	const body = await req.json();
	const { name, image: imageBase64 } = body;

	const descriptionImage = await generateDescription(imageBase64, name);

	console.log({ descriptionImage });

	console.log('Descripción de la imagen:', descriptionImage);

	if (!descriptionImage) {
		return new NextResponse('Falló la generación de la descripción de la imagen', {
			status: 500,
		});
	}

	const idNotas = await db
		.insert($notes)
		.values({
			name,
			userId,
			imageUrl: imageBase64,
			description: descriptionImage,
		})
		.returning({
			insertedId: $notes.id,
		});

	//++ verificar si se recuperó correctamente idNotas
	console.log('ID de notas:', idNotas);

	// return NextResponse.json({
	// 	note_id: idNotas[0].insertedId,
	// });

	return new NextResponse('ok', { status: 200 });
}
