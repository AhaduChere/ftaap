
import { supabase } from '../supabase.js'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  const { data, error } = await supabase
    .from('Organization')
    .select('id, organization_name')
    .order('organization_name', { ascending: true })

  if (error) {
    console.error('Error fetching organizations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch organizations.',
    })
  }

  return (data ?? []).map((o: Organization) => ({
    id: Number(o.id),
    organization_name: o.organization_name ?? '',
  }))
})
