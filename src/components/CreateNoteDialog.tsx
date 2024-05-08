'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CloudUpload, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';

type Props = {};
const CreateNoteDialog = (props: Props) => {
	const [image, setImage] = useState<string>('/img/image-void.png');
	const [input, setInput] = useState('');

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const router = useRouter();

	const createNoteBook = useMutation({
		mutationFn: async () => {
			try {
				const response = await axios.post('/api/createNoteBook', {
					name: input,
					image,
				});

				return response.data;
			} catch (err) {
				console.error(err);
			}
		},
	});

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const uploadedImage = e.target.files?.[0];

		if (uploadedImage) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};

			reader.readAsDataURL(uploadedImage);
		}
	};

	const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (input === '') {
			window.alert('Por favor ingrese un nombre para su cuaderno.');
			return;
		}

		createNoteBook.mutate(undefined, {
			onSuccess: () => {
				console.log('yeyy se creó un cuaderno');
				router.push(`/dashboard`);
				setIsDialogOpen(false);
			},
			onError: (err) => {
				console.error(err);
				window.alert('No se pudo crear un cuaderno');
			},
		});
	};

	return (
		<Dialog open={isDialogOpen}>
			<DialogTrigger onClick={() => setIsDialogOpen(true)}>
				<div className="border-dashed border-2 flex border-green-600 h-full w-[235px] rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
					<Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
					<h2 className="font-semibold text-green-600 sm:mt-2">Nuevo</h2>
				</div>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nuevo cuaderno de notas</DialogTitle>
					<DialogDescription>
						Crea una nueva nota subiendo una imagen de portada. la IA le dará una descripción
						adecuada y genial acorde a la imagen.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handlerSubmit}>
					<div className="flex flex-col gap-4">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							id="fileInput"
							className="hidden"
							required
						/>
						<label
							htmlFor="fileInput"
							className="cursor-pointer text-sm flex items-center gap-2">
							<CloudUpload />
							Cargar
						</label>
						{/* mostrar la imagen del estado, que será la imagen por defecto o la cargada por el usuario */}
						<div className="flex justify-center items-center">
							<img src={image} className="w-1/2" alt="Uploaded" />
						</div>

						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Definir un título para la portada"
						/>
					</div>
					<div className="h-4"></div>
					<div className="flex items-center gap-2">
						<Button type="reset" variant={'secondary'}>
							Cancelar
						</Button>
						<Button className="bg-green-600" disabled={createNoteBook.isPending}>
							{createNoteBook.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							Crear
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
export default CreateNoteDialog;
