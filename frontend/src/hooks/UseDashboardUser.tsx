import { useState } from 'react'
import type { UserDashboardResponse } from '../types/auth.types'
import { getUserDashboardService } from '../services/auth.service'

const useDashboardUser = () => {
  const [user, setUser] = useState<UserDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchUser() {
    try {
      const res = await getUserDashboardService()
      setUser(res.data)
    } catch (error: any) {
      setError(error?.response?.data.message)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, fetchUser }
}

export default useDashboardUser
