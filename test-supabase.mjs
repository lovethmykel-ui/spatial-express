import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://jdbdukhwpbbzkjfqwxgg.supabase.co', 'sb_publishable_ncJeMD0bMrv1iBA7gtUCag_xCRYVjG5')

async function test() {
  const { data, error } = await supabase.from('airdrops').select('*').limit(1)
  console.log('Data:', data)
  console.log('Error:', error)
}
test()
