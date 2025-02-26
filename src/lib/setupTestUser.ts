
import { supabase } from "./supabase";

export async function createTestUser() {
  // First user
  const { data: data1, error: error1 } = await supabase.auth.signUp({
    email: 'testuser@gmail.com',
    password: 'password123',
  });

  // Second user
  const { data: data2, error: error2 } = await supabase.auth.signUp({
    email: 'test@abclabs.se',
    password: '123',
  });

  if (error1 && error2) {
    console.error('Error creating test users:', error1, error2);
    return { error: error1 };
  }

  return data1 || data2;
}
