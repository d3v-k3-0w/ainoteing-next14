'use client';

import { NoteType } from '@/lib/db/schema';
import { useDebounce } from '@/lib/useDebounce';
import { useMutation } from '@tanstack/react-query';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import TipTapMenuBar from './TipTapMenuBar';
import { Button } from './ui/button';
import { TriangleAlert } from 'lucide-react';

//++ propiedad note que tiene el valor del schema NoteType
type Props = { note: NoteType };

const TipTapEditor = ({ note }: Props) => {
	const [editorState, setEditorState] = useState(note.editorState || `<h1>${note.name}</h1>`);

	const lastCompletion = useRef('');

	const completionMutation = useMutation({
		mutationFn: (prompt: string) => axios.post('/api/completion', { prompt }),
		onSuccess: (data) => {
			// console.log(data);

			lastCompletion.current = data.data.completion;
		},
	});

	const saveNote = useMutation({
		mutationFn: async () => {
			const response = await axios.post('/api/saveNote', {
				noteId: note.id,
				editorState,
			});

			return response.data;
		},
	});

	const customText = Text.extend({
		addKeyboardShortcuts() {
			return {
				'Shift-a': () => {
					//++ extraer las ultimas 30 palabras
					const currentText = this.editor.getText().split(' ').slice(-30).join(' ');

					//++ formatear el texto como un prompt para la API de completación
					const prompt = `Eres una inteligencia artificial útil posees conocimientos de experto, utilidad, inteligencia y elocuencia. Además, te comportas de manera cortés y tienes buenos modales.Estoy escribiendo un texto, necesito tu ayuda para completarlo. Mantén el tono consistente con el resto del texto y asegúrate de que la respuesta sea breve, y agradable. Continúa con mi idea sobre lo siguiente: ${currentText}`;

					//++ enviar el prompt a la API de completación
					completionMutation.mutate(prompt);

					return true;
				},
			};
		},
	});

	const editor = useEditor({
		autofocus: true,
		extensions: [StarterKit, customText],
		content: editorState,
		onUpdate: ({ editor }) => {
			setEditorState(editor.getHTML());
		},
	});

	useEffect(() => {
		if (!editor || !lastCompletion.current) return;

		//++ dividir la respuesta de la IA en palabras individuales
		const words = lastCompletion.current.split(' ');

		//++ función que agrega las palabras al editor una por una
		const addWords = async () => {
			for (let word of words) {
				editor.commands.insertContent(word + ' ');
				await new Promise((resolve) => setTimeout(resolve, 100)); // ajustar el retraso según sea necesario
			}
		};

		addWords();
	}, [lastCompletion.current, editor]);

	//++ cuando estamos escribiendo muy rápido en el editor, no queremos guardar todo el texto completo , seria un
	// gran desperdicio de recursos , es muy lento y no es optimo asi que usamos debounce esto esperara un tiempo a
	// que termines de escribir y recién hará el guardado de texto en la db
	const debounceEditorState = useDebounce(editorState, 500);

	useEffect(() => {
		//++ guardar el estado del editor debounced
		if (debounceEditorState === '') return;

		saveNote.mutate(undefined, {
			onSuccess: (data) => {
				console.log('success update!', data);
			},
			onError: (err) => {
				console.error(err);
			},
		});
	}, [debounceEditorState]);

	return (
		<div>
			<div className="flex justify-between items-center">
				{editor && <TipTapMenuBar editor={editor} />}
				<Button className="bg-stone-800 text-white" disabled variant={'outline'}>
					{saveNote.isPending ? 'agregando...' : 'Guardado'}
				</Button>
			</div>

			{/* recordar que instale la tipografía de tailwind eso talvez hace que aplique todo el h1 y no al sombreado */}
			<div className="prose prose-sm w-full mt-4">
				<EditorContent editor={editor} />
			</div>
			<div className="h-4"></div>
			<div className="flex items-center p-2 justify-between">
				<span className="text-sm">
					Tip:Presione{' '}
					<kbd className="px-1.5 py-1.5 text-xs font-bold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
						Shift + A
					</kbd>{' '}
					autocompletar IA
				</span>

				<span className="flex items-center ml-2">
					<TriangleAlert className="w-4 h-4 fill-current text-yellow-500" />
					<span className="text-sm ml-1">
						Usa IA con precaución: no varias veces seguidas.
					</span>
				</span>
			</div>
		</div>
	);
};

export default TipTapEditor;
