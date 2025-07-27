import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import styles from '../styles/Auth.module.css'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className= {styles.div}>
     <form onSubmit={handleLogin} className={styles.form}>
      <h1 className={styles.h1}>Login</h1>
       <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className = {styles.input}
          />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className = {styles.input} 
        />
        <button type="submit" className={styles.button}>Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
      </div>
  )
}

