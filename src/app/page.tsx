import TypeWriter from '@/components/TypeWriter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<div className="min-h-screen grainy">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<h1 className="font-semibold text-5xl text-center">
					<span className="text-green-600 font-bold">AI noteing</span> <br /> Tú inteligente
					Tomador de notas.
				</h1>
				<div className="mt-4"></div>
				<h2 className="font-semibold text-3xl text-center text-slate-700">
					<TypeWriter />
				</h2>
				<div className="mt-8"></div>

				<div className="flex justify-center">
					<Link href="/sign-in">
						<Button className="bg-green-600">
							Empezar
							<ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
