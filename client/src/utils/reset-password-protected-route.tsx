import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";
import { useEffect } from "react";

const ResetPasswordProtectedRoute = ({ children }: { children : React.ReactNode}) => {

  const { checkResetPasswordToken } = useAuthStore()
  const { token } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        return <Navigate to="/login" replace/>
      }
      try {
        await checkResetPasswordToken(token)
      } catch {
        navigate("/login")
      }
    }
    checkToken()
  },[checkResetPasswordToken, token, navigate])
  
  return children
}
 
export default ResetPasswordProtectedRoute;