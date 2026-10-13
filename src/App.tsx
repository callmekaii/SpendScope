import { Button } from "@/components/ui/button"
import { LoginForm } from "./components/login-form"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"

export function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)

  //session check on page load
  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    setLoading(false)
  })
  
  // Listen for changes to the auth state (e.g., user logs in or out)
  const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

  return () => 
    subscription?.unsubscribe()
  },[])

  // Show a loading state while checking for the session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground animate-pulse text-sm">
          Loading SpendScope...
        </div>
      </div>
    )
  }

  //slap that login form in here if the user is not logged in
  if (!session) {
    return(    
    <div className="flex min-h-screen justify-center items-center p-6">
      <LoginForm />
    </div>
    )
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
    <div>You are logged in</div>
      <Button
      onClick={() => {
        supabase.auth.signOut()
      }}
    >
      Logout User
    </Button>
    </div>
  )
}

export default App
