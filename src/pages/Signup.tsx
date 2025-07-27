import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import styles from '../styles/Auth.module.css'

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Account created! You can now log in.")
      setTimeout(() => navigate("/"), 2000)
    }
  }

  return (
    <div className={styles.div}>
      <form onSubmit={handleSignup} className={styles.form}>
      <h1 className={styles.h1}>Sign Up</h1>
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
        <button type="submit" className = {styles.button}>Create Account</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
    </div>
  )
}

