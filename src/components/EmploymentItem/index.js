import './index.css'

const EmploymentItem = props => {
  const {eachType} = props
  const {label, employmentTypeId} = eachType

  return (
    <li className="employment-type-item">
      <input id={employmentTypeId} type="checkbox" className="checkbox" />
      <label htmlFor={employmentTypeId} className="label-text">
        {label}
      </label>
    </li>
  )
}

export default EmploymentItem
