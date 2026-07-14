import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://jdbdukhwpbbzkjfqwxgg.supabase.co', 'sb_publishable_ncJeMD0bMrv1iBA7gtUCag_xCRYVjG5')

async function seed() {
  console.log('Seeding test data...')
  
  const { data: airdrop, error: airdropError } = await supabase
    .from('airdrops')
    .insert({
      name: 'Test Airdrop',
      chain: 'Ethereum',
      effort: 'medium',
      description: 'This is a sample airdrop campaign to test the tracker functionality.',
      link: 'https://example.com'
    })
    .select()
    .single()

  if (airdropError) {
    console.error('Error creating airdrop:', airdropError)
    return
  }

  const { error: taskError } = await supabase
    .from('airdrop_tasks')
    .insert([
      { airdrop_id: airdrop.id, label: 'Follow on Twitter', sort_order: 1 },
      { airdrop_id: airdrop.id, label: 'Join Discord', sort_order: 2 },
      { airdrop_id: airdrop.id, label: 'Connect Wallet', sort_order: 3 },
    ])

  if (taskError) {
    console.error('Error creating tasks:', taskError)
  } else {
    console.log('Successfully inserted test airdrop and 3 tasks!')
  }
}
seed()
