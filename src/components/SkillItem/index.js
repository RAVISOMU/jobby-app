import './index.css'

const SkillItem = props => {
  const {eachSkill} = props
  const {imageUrl, name} = eachSkill

  return (
    <li className="skill-item">
      <img src={imageUrl} alt={name} className="skill-image" />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillItem
