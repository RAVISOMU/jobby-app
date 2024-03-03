import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {eachJob} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = eachJob

  return (
    <li className="similar-job-item">
      <div className="similar-job-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="logo"
        />
        <div className="similar-job-title-rating-container">
          <h1 className="similar-job-title">{title}</h1>
          <div className="similar-job-rating-container">
            <FaStar className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-job-description-text">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="similar-job-location-employment-container">
        <div className="similar-job-location-container">
          <MdLocationOn className="location-icon" />
          <p className="location">{location}</p>
        </div>
        <div className="similar-job-employment-container">
          <BsBriefcaseFill className="briefcase-icon" />
          <p className="employment-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
