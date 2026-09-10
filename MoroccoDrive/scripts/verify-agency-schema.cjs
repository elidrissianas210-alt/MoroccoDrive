const postgres = require("postgres");

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

(async () => {
  try {
    const tables = await sql.unsafe("select table_name from information_schema.tables where table_schema = 'public' and table_name in ('profiles','agencies','cars') order by table_name");
    const columns = await sql.unsafe("select table_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name in ('profiles','agencies','cars') order by table_name, ordinal_position");
    const constraints = await sql.unsafe("select table_name, constraint_name, constraint_type from information_schema.table_constraints where table_schema = 'public' and table_name in ('profiles','agencies','cars') order by table_name, constraint_name");
    const policies = await sql.unsafe("select policyname, cmd, roles, qual, with_check from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname like 'vehicle images%' order by policyname");
    const foreignKeys = await sql.unsafe("select tc.table_name, kcu.column_name, ccu.table_name as referenced_table, ccu.column_name as referenced_column from information_schema.table_constraints tc join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema join information_schema.constraint_column_usage ccu on ccu.constraint_name = tc.constraint_name and ccu.table_schema = tc.table_schema where tc.constraint_type = 'FOREIGN KEY' and tc.table_schema = 'public' and tc.table_name in ('profiles','agencies','cars') order by tc.table_name");
    console.log(JSON.stringify({ tables, columns, constraints, policies, foreignKeys }, null, 2));
  } finally {
    await sql.end();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
