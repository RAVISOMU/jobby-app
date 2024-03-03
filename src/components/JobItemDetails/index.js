import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'
import SkillItem from '../SkillItem'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.pending})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(eachJob => ({
          name: eachJob.name,
          imageUrl: eachJob.image_url,
        })),
        title: data.job_details.title,
      }

      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJobsDetails,
        similarJobs: updatedSimilarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemDetailsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.getJobItemDetails()
  }

  renderJobItemDetailsFailureView = () => (
    <div className="job-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderJobItemDetailsSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      packagePerAnnum,
      title,
      rating,
      employmentType,
      location,
      jobDescription,
      skills,
      id,
      lifeAtCompany,
    } = jobDetails
    const {imageUrl, description} = lifeAtCompany

    return (
      <div className="job-item-details-container">
        <div className="job-item-details-item">
          <div className="title-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <FaStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-employment-package-container">
            <div className="location-employment-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="employment-container">
                <BsBriefcaseFill className="briefcase-icon" />
                <p className="employment-type">{employmentType}</p>
              </div>
            </div>
            <p className="package-per-annum">{packagePerAnnum}</p>
          </div>
          <hr className="job-card-hr-line" />
          <div className="visit-container">
            <h1 className="description-text">Description</h1>
            <a
              href={companyWebsiteUrl}
              className="visit-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>Visit</p>
              <FaExternalLinkAlt className="visit-link-icon" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-text">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachSkill => (
              <SkillItem eachSkill={eachSkill} key={id} />
            ))}
          </ul>
          <div className="life-at-company-container">
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="description-image-container">
              <p className="life-at-company-description">{description}</p>
              <img
                src={imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
        </div>
        <div>
          <SimilarJobs similarJobs={similarJobs} />
        </div>
      </div>
    )
  }

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemDetailsFailureView()
      case apiStatusConstants.pending:
        return this.renderJobItemDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderJobItemDetails()}
      </div>
    )
  }
}

export default JobItemDetails
