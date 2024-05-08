'use client';

import Typewriter from 'typewriter-effect';

type Props = {};
const TypeWriter = (props: Props) => {
	return (
		<Typewriter
			options={{
				loop: true,
			}}
			onInit={(typewriter) => {
				typewriter
					.typeString('⚡productividad elevada.')
					.pauseFor(1000)
					.deleteAll()
					.typeString('✨Información basada en IA.')
					.start();
			}}
		/>
	);
};
export default TypeWriter;
