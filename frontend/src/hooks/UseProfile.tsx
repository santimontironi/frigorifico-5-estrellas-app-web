import { useState } from 'react'
import type { ProfileResponse } from '../types/auth.types'
import { getProfileService } from '../services/auth.service'

const useProfile = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProfile() {
    try {
      const res = await getProfileService()
      setProfile(res.data)
    } catch (error: any) {
      setError(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, fetchProfile }
}

export default useProfile
