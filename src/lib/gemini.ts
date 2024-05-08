import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
	throw new Error('Falta la clave API de Gemini en la variable de entorno GEMINI_API_KEY');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateDescription(imageBase64: string, userInput: string) {
	if (!imageBase64) {
		return;
	}

	// utilizar la clave API y el modelo gemini-pro-vision para analizar la imagen
	const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

	// texto de consulta para Gemini que incorpora el input del usuario
	const prompt = `Genera una descripción concisa y cautivadora de esta imagen, adecuada para una tarjeta mediana. Incorpora el texto proporcionado por el usuario: ${userInput}. Céntrese en las características clave y transmita la esencia de una manera concisa y atractiva. Asegúrese de que la descripción sea detallada pero breve, destacando las cualidades únicas de la imagen.`;

	// extraer los datos base64 y el tipo de imagen de la cadena
	const match = imageBase64.match(/^data:(.*);base64,(.*)$/);

	if (!match) {
		throw new Error('Invalid image data');
	}

	const mimeType = match[1];
	const base64Data = match[2];

	//++ crear el objeto Part para Gemini
	const imagePart: Part = {
		inlineData: {
			data: base64Data,
			mimeType,
		},
	};

	try {
		const result = await model.generateContent([prompt, imagePart]);
		const response = await result.response;
		const description = response.text();

		return description; // devolver la descripción generada
	} catch (err) {
		console.error(err);
	}
}

export async function generateCompletion(prompt: string): Promise<string | undefined> {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
		const result = await model.generateContentStream([prompt]);
		let completion = '';

		for await (const chunk of result.stream) {
			const chunkText = chunk.text() as string; // aserción de tipo
			completion += chunkText;
		}

		return completion;
	} catch (err) {
		console.error('Error generating completion:', err);
		return undefined;
	}
}
