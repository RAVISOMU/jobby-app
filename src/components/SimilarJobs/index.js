import './index.css'

import SimilarJobItem from '../SimilarJobItem'

const SimilarJobs = props => {
  const {similarJobs} = props

  return (
    <div>
      <h1 className="similar-jobs-heading">Similar Jobs</h1>
      <ul className="similar-jobs-list">
        {similarJobs.map(eachJob => (
          <SimilarJobItem eachJob={eachJob} key={eachJob.id} />
        ))}
      </ul>
    </div>
  )
}

export default SimilarJobs
