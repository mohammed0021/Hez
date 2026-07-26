'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getExerciseLibrary() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('exercise_library').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getExercisesByMuscleGroup(muscleGroup: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('exercise_library')
    .select('*')
    .contains('muscle_group', [muscleGroup])
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function searchExercises(query: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('exercise_library')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getExerciseById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('exercise_library').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
