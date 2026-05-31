import { supabase } from './lib/supabase';

async function checkSchema() {
  const { data, error } = await supabase.from('chats').select('*').limit(1);
  if (error) {
    console.log('Error fetching chats:', error.message);
  } else {
    console.log('Chats table exists:', data);
  }

  const { data: msgData, error: msgError } = await supabase.from('messages').select('*').limit(1);
  if (msgError) {
    console.log('Error fetching messages:', msgError.message);
  } else {
    console.log('Messages table exists:', msgData);
  }
}

checkSchema();
