import './index.css'

const SalaryItem = props => {
  const {eachSalary} = props
  const {label, salaryRangeId} = eachSalary

  return (
    <li className="salary-item">
      <input id={salaryRangeId} type="radio" className="salary-input" />
      <label className="label-text" htmlFor={salaryRangeId}>
        {label}
      </label>
    </li>
  )
}

export default SalaryItem
