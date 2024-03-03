import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import JobCard from '../JobCard'

import Header from '../Header'

import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsList: {},
    employmentTypeInputs: [],
    jobsApiStatus: apiStatusConstants.initial,
    salaryInput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.pending})
    const {searchInput, salaryInput, employmentTypeInputs} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeInputs.join()}&minimum_package=${salaryInput}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const jobsData = await response.json()
      const updatedJobsData = jobsData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: updatedJobsData,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onChangeSalaryRange = event => {
    this.setState({salaryInput: event.target.id}, this.getJobDetails)
  }

  onChangeEmploymentType = event => {
    const {employmentTypeInputs} = this.state
    const typesNotChecked = employmentTypeInputs.filter(
      eachType => eachType === event.target.id,
    )
    if (typesNotChecked.length === 0) {
      this.setState(
        prevState => ({
          employmentTypeInputs: [
            ...prevState.employmentTypeInputs,
            event.target.id,
          ],
        }),
        this.getJobDetails,
      )
    } else {
      const allFiltersData = employmentTypeInputs.filter(
        eachType => eachType !== event.target.id,
      )
      this.setState({employmentTypeInputs: allFiltersData}, this.getJobDetails)
    }
  }

  onRetryJobs = () => {
    this.getJobDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {jobsList} = this.state
    return (
      <>
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobCard eachJob={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </>
    )
  }

  renderJobDetailsFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobsAvailable = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobsList} = this.state
    const isJobsAvailable = jobsList.length !== 0

    return (
      <div className="jobs-search-container">
        {isJobsAvailable ? this.renderJobs() : this.renderNoJobsAvailable()}
      </div>
    )
  }

  renderJobsDetails = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      case apiStatusConstants.pending:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onSearchJob = event => {
    event.preventDefault()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.pending})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUl, options)
    if (response.ok === true) {
      const profileData = await response.json()
      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getProfileDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="retry-button-container">
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <>
        <div className="profile-laptop-container">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
          <h1 className="profile-name">{name}</h1>
          <p className="short-bio">{shortBio}</p>
        </div>
        <hr className="line" />
        <br />
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
          <h1 className="profile-name">{name}</h1>
          <p className="short-bio">{shortBio}</p>
        </div>
        <hr className="hr-line" />
      </>
    )
  }

  renderProfileDetails = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.pending:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, employmentTypeInputs, salaryInput} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-responsive-container">
          <form className="search-input-container" onSubmit={this.onSearchJob}>
            <input
              type="search"
              className="search-jobs-mobile-input"
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              value={searchInput}
            />
            <button
              type="submit"
              testid="searchButton"
              className="search-button"
              aria-label="search"
            >
              <BsSearch className="search-icon" />
            </button>
          </form>
          <div className="filters-group-container">
            <div className="filters-group-responsive-container">
              {this.renderProfileDetails()}
              <h1 className="employment-type-heading">Type of Employment</h1>
              <ul className="employment-type-list">
                {employmentTypesList.map(eachType => (
                  <li
                    className="employment-type-item"
                    key={eachType.employmentTypeId}
                  >
                    <input
                      id={eachType.employmentTypeId}
                      type="checkbox"
                      className="checkbox"
                      value={employmentTypeInputs}
                      onChange={this.onChangeEmploymentType}
                    />
                    <label
                      htmlFor={eachType.employmentTypeId}
                      className="label-text"
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr className="hr-line" />
              <hr className="line" />
              <br />
              <h1 className="salary-range-heading">Salary Range</h1>
              <ul className="salary-range-list">
                {salaryRangesList.map(eachSalary => (
                  <li className="salary-item" key={eachSalary.salaryRangeId}>
                    <input
                      id={eachSalary.salaryRangeId}
                      type="radio"
                      className="salary-input"
                      name="salary"
                      onChange={this.onChangeSalaryRange}
                      value={salaryInput}
                    />
                    <label
                      className="label-text"
                      htmlFor={eachSalary.salaryRangeId}
                    >
                      {eachSalary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="search-input-jobs-container">
              <form
                className="search-input-laptop-container"
                onSubmit={this.onSearchJob}
              >
                <input
                  onChange={this.onChangeSearchInput}
                  type="search"
                  className="search-jobs-laptop-input"
                  placeholder="Search"
                  value={searchInput}
                />
                <button
                  type="submit"
                  testid="searchButton"
                  className="search-button"
                  aria-label="search"
                >
                  <BsSearch className="search-icon" />
                </button>
              </form>
              {this.renderJobsDetails()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
