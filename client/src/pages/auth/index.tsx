import { useState, SyntheticEvent } from "react"
import axios from "axios"
import { UserErrors } from "../../error"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export const AuthPage = () => {
  return (
    <div className="auth">
      <Register /> <Login />
    </div>
  )
}

const Register = () => {

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    try {
      await axios.post("http://localhost:3001/user/register", {
        username,
        password,
      })
      alert("User Successfully Registered Go to LOGIN")

    } catch (err) {
      if (err?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXIST) {
        alert("Error: Username Already in use.")
      } else {
        alert("Error: Something went Wrong")
      }
    }

  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            value={username}
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete=""
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}



const Login = () => {

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [, setCookies] = useCookies(["access_token"])

  const navigate = useNavigate()

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      })
      setCookies("access_token", result.data.token);
      localStorage.setItem("userId", result.data.userId)
       navigate("/")
    } catch (err) {
      let errorMessage: string = ""
      switch (err.response.data.type) {
        case UserErrors.NO_USER_FOUND:
          errorMessage = "User does't Exist"
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Invalid Crenditials"
          break;
        default:
          errorMessage = "Something Went Wrong"
      }
      alert("Error: " + errorMessage)
    }

  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            value={username}
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete=""
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}



