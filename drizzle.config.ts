import { defineConfig } from 'drizzle-kit';
import './envConfig';

export default defineConfig({
	driver: 'pg',
	schema: './src/lib/db/schema.ts',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
});
