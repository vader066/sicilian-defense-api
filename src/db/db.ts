import { Pool } from 'pg';
 
export const pool = new Pool({
  host: 'localhost',
  user: 'rey',
  password: 'Andromed@47',
  database: 'sicilian-main',
  port: 5432,
  max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
  // maxLifetimeSeconds: 60
});
