import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <ul className="navbar-content">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo"
            />
          </Link>
        </li>
        <div className="nav-mobile-container">
          <ul className="nav-items-list">
            <li>
              <Link to="/">
                <AiFillHome className="home-icon" />
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <BsBriefcaseFill className="briefcase-icon" />
              </Link>
            </li>
            <li>
              <button
                className="logout-icon-button"
                type="button"
                onClick={onClickLogoutButton}
                aria-label="logout"
              >
                <FiLogOut className="logout-icon" />
              </button>
            </li>
          </ul>
        </div>
        <li className="nav-laptops-container">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
        <li className="log-out-container">
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogoutButton}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
