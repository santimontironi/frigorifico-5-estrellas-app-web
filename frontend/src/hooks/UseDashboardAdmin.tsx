import { useState } from 'react'
import type { AdminDashboardResponse } from '../types/auth.types'
import { getAdminDashboardService } from '../services/auth.service'

const useDashboardAdmin = () => {
  const [admin, setAdmin] = useState<AdminDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchAdmin() {
    try {
      const res = await getAdminDashboardService()
      setAdmin(res.data)
    } catch (error: any) {
      setError(error?.response?.data.message)
    } finally {
      setLoading(false)
    }
  }

  return { admin, loading, error, fetchAdmin }
}

export default useDashboardAdmin
