import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

const CourseItem = props => {
  const {courseDetails} = props
  const {logoUrl, name, id} = courseDetails

  return (
    <li className="list">
      <Link to={`/courses/${id}`} className="link">
        <img src={logoUrl} alt={name} className="logo" />
        <p className="name">{name}</p>
      </Link>
    </li>
  )
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstraints.initial,
    dataList: [],
  }

  componentDidMount() {
    this.onGetFetchApiCall()
  }

  onGetFetchApiCall = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})

    const url = `https://apis.ccbp.in/te/courses`
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.courses.map(each => ({
        id: each.id,
        logoUrl: each.logo_url,
        name: each.name,
      }))
      this.setState({
        dataList: updatedData,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onClickRetry = () => {
    this.onGetFetchApiCall()
  }

  renderInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4656a1" height="40" width="40" />
    </div>
  )

  onFailureDisplayCourses = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="oops-error">Oops! Something Went Wrong</h1>
      <p className="failure-error-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderSuccessPage = () => {
    const {dataList} = this.state

    return (
      <ul className="all-courses">
        {dataList.map(item => (
          <CourseItem courseDetails={item} key={item.id} />
        ))}
      </ul>
    )
  }

  onRenderAllDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inprogress:
        return this.renderInProgress()
      case apiStatusConstraints.success:
        return this.renderSuccessPage()
      case apiStatusConstraints.failure:
        return this.onFailureDisplayCourses()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <h1 className="heading">Courses</h1>
        {this.onRenderAllDetails()}
      </div>
    )
  }
}

export default Home
