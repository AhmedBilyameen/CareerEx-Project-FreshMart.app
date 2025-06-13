import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ padding: '20px', backgroundColor: '#f3f4f6' }}>
      <Link to="/Home" style={{ marginRight: '15px' }}>Home</Link>
      <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
      <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  )
}

export default Navbar
