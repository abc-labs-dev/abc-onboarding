
import { supabase } from "./supabase";

export async function createTestUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'password123',
  });

  if (error) {
    console.error('Error creating test user:', error);
    return;
  }

  return data;
}
