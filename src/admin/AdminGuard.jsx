import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DUREE_SESSION = 4 * 60 * 60 * 1000 // 4 heures

export function useAdminGuard() {
  const navigate = useNavigate()

  useEffect(() => {
    const auth = sessionStorage.getItem('bksc_admin_auth')
    const timestamp = sessionStorage.getItem('bksc_admin_time')
    const maintenant = Date.now()

    if (!auth || !timestamp || maintenant - parseInt(timestamp) > DUREE_SESSION) {
      sessionStorage.removeItem('bksc_admin_auth')
      sessionStorage.removeItem('bksc_admin_time')
      navigate('/admin', { replace: true })
    }
  }, [navigate])
}

export function setAdminSession() {
  sessionStorage.setItem('bksc_admin_auth', 'true')
  sessionStorage.setItem('bksc_admin_time', Date.now().toString())
}

export function clearAdminSession() {
  sessionStorage.removeItem('bksc_admin_auth')
  sessionStorage.removeItem('bksc_admin_time')
}