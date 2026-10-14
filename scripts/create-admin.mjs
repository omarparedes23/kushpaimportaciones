// Uso: node scripts/create-admin.mjs <email> [password]
// Crea un usuario confirmado con rol admin (sin password genera una temporal).
// Si el email ya existe, indica como asignar el rol por SQL.
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';

// Parse .env.local robustly (handles values with = signs)
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf-8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter(k => !env[k]);
if (missing.length) {
  console.error('Faltan variables en .env.local:', missing.join(', '));
  process.exit(1);
}

const [email, passwordArg] = process.argv.slice(2);
if (!email) {
  console.error('Uso: node scripts/create-admin.mjs <email> [password]');
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const password = passwordArg ?? `Kp-${randomBytes(9).toString("base64url")}`;
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { role: "admin" },
});

if (error) {
  if (error.code === "email_exists") {
    console.error(`${email} ya existe. Asigna el rol por SQL: UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' WHERE email = '${email}';`);
  } else {
    console.error("Error:", error.message);
  }
  process.exit(1);
}

console.log(`Admin creado: ${data.user.email} (${data.user.id})`);
if (!passwordArg) console.log(`Contraseña temporal: ${password}`);
