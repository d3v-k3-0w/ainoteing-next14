import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { $notes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
	try {
		const body = await req.json();

		let { noteId, editorState } = body;

		if (!editorState || !noteId) {
			return new NextResponse('Missing editorState or noteId', { status: 400 });
		}

		noteId = parseInt(noteId);

		const notes = await db.select().from($notes).where(eq($notes.id, noteId));

		if (notes.length != 1) {
			return new NextResponse('Failed to update', { status: 500 });
		}

		const note = notes[0];

		//++ si el editorState de la db es diferente al nuevo editorState
		if (note.editorState !== editorState) {
			await db
				.update($notes)
				.set({
					editorState,
				})
				.where(eq($notes.id, noteId));
		}

		return NextResponse.json(
			{
				success: true,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{
				success: false,
			},
			{ status: 500 }
		);
	}
}
