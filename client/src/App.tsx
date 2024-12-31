import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import FloatingShape from "./components/floating-shape"
import SignUpPage from "./pages/signup"
import LoginPage from "./pages/login"
import EmailVerificationPage from "./pages/email-verification"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/auth-store"
import { useEffect } from "react"
import HomePage from "./pages/home"
import ProtectedRoute from "./utils/protected-route"
import RedirectAuthenticatedUser from "./utils/redirect-authenticated-user"
import Spinner from "./components/spinner"
import ForgotPasswordPage from "./pages/forgot-password"
import ResetPasswordPage from "./pages/reset-password"
import ResetPasswordProtectedRoute from "./utils/reset-password-protected-route"

function App() {

  const { checkAuth, isCheckingAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  },[checkAuth, location])

  if (isCheckingAuth) {
    return <Spinner />
  }

  return (
   <div
    className="
      min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900
      flex items-center justify-center relative overflow-hidden
    "
   >
    <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
    <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }/>
      <Route path="/signup" element={
        <RedirectAuthenticatedUser>
          <SignUpPage/>
        </RedirectAuthenticatedUser>
      }/>
      <Route path="/login" element={
        <RedirectAuthenticatedUser>
          <LoginPage/>
        </RedirectAuthenticatedUser>
      }/>
      <Route path="/verify-email" element={
        <RedirectAuthenticatedUser>
          <EmailVerificationPage />
        </RedirectAuthenticatedUser>
        }/>
      <Route path="/forgot-password" element={
        <RedirectAuthenticatedUser>
          <ForgotPasswordPage />
        </RedirectAuthenticatedUser>
        }/>
      <Route path="/reset-password/:token" element={
        <RedirectAuthenticatedUser>
          <ResetPasswordProtectedRoute>
            <ResetPasswordPage />
          </ResetPasswordProtectedRoute>
        </RedirectAuthenticatedUser>
      }/>
      {/* catch all routes */}
			<Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
    <Toaster />
   </div>
  )
}

export default App
