import CreateNoteDialog from '@/components/CreateNoteDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {};
export default async function DashboardPage({}: Props) {
	const { userId } = auth();

	const notes = await db.select().from($notes).where(eq($notes.userId, userId!));

	return (
		<div className="grainy min-h-screen">
			<div className="max-w-7xl mx-auto p-10">
				<div className="h-14"></div>
				<div className="flex justify-between items-center">
					<Link href="/">
						<Button className="bg-green-600" size="sm">
							<ArrowLeft className="mr-1 w-4 h-4" />
							Atrás
						</Button>
					</Link>
					<div className="text-center items-center">
						<h1 className="text-3xl font-bold">Mis notas</h1>
					</div>
					<div className="flex justify-end">
						<ThemeToggle />
						<div className="w-4"></div>
						<UserButton />
					</div>
				</div>
				<div className="h-8"></div>
				<Separator />
				{/* ctrl flecha arriba , flecha abajo para scroll de vscode */}
				<div className="h-8"></div>

				{notes.length === 0 && (
					<div className="text-center">
						<h2 className="text-xl text-gray-500">Aún no tienes notas.</h2>
					</div>
				)}

				{/* display all the notes */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 md:gap-1 gap-4 place-content-center">
					<CreateNoteDialog />
					{notes.map((note) => (
						<a href={`/notebook/${note.id}`} className="flex justify-center" key={note.id}>
							<div className="overflow-hidden rounded-2xl border min-h-50 w-[260px] border-gray-200 flex flex-col hover:shadow-lg transition hover:-translate-y-1">
								<img
									src={note.imageUrl || ''}
									alt={note.name}
									className="object-cover w-full h-full"
								/>
								<div className="p-2">
									<h3 className="text-xl font-semibold text-gray-700">{note.name}</h3>
									<h1 className="h-2"></h1>
									<p className="text-sm text-gray-500 leading-5 bg-gray-100 p-1 rounded-md border-b-2 border-t-2 border-gray-200 overflow-y-scroll  max-h-32">
										{note.description}
									</p>
									<div className="flex justify-end ">
										<p className="text-sm text-gray-700 bg-gray-200 mt-2 w-fit rounded-md font-medium border border-gray-300 overflow-hidden">
											{new Date(note.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
