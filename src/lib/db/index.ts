import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

//++ almacenar todas las conexiones en el cache, recuperar la conexión cada vez qe se recarga la pagina
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

//++ invocar a la URL de conexión SQL
const SQL = neon(process.env.DATABASE_URL);

//++ exportar la database
export const db = drizzle(SQL);

// db.select().from().where()

//  npx drizzle-kit push:pg
//  npx drizzle-kit studio
