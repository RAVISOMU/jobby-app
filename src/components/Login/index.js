import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrMsg: false, errMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmit = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.setState({showErrMsg: true, errMsg: data.error_msg})
    }
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {showErrMsg, errMsg} = this.state
    return (
      <div className="jobby-app-container">
        <form className="jobby-app-user-form" onSubmit={this.onSubmit}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label htmlFor="userName" className="label">
            USERNAME
          </label>
          <input
            placeholder="Username"
            type="text"
            id="userName"
            className="user-input"
            onChange={this.onChangeUserName}
          />
          <label htmlFor="userPassword" className="label">
            PASSWORD
          </label>
          <input
            placeholder="Password"
            type="password"
            id="userPassword"
            className="user-input"
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {showErrMsg && <p className="error-message">{errMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
