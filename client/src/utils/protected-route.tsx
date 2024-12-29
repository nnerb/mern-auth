import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/auth-store"

const ProtectedRoute = ({ children } : { children : React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace /> 
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace/>
  }
  return children
}

export default ProtectedRoute