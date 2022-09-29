import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class CourseItem extends Component {
  state = {apiStatus: apiStatusConstraints.initial, dataList: {}}

  componentDidMount() {
    this.onGetFetchApiCall()
  }

  onGetFetchApiCall = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      const updateData = {
        id: data.course_details.id,
        name: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      this.setState({
        dataList: updateData,
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

  renderSuccessCourse = () => {
    const {dataList} = this.state
    const {imageUrl, name, description} = dataList

    return (
      <div className="course-container">
        <img src={imageUrl} alt={name} className="course-image" />
        <div>
          <h1 className="course-heading">{name}</h1>
          <p className="course-description">{description}</p>
        </div>
      </div>
    )
  }

  onRenderItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inprogress:
        return this.renderInProgress()
      case apiStatusConstraints.success:
        return this.renderSuccessCourse()
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
        <div className="details-container">{this.onRenderItemDetails()}</div>
      </div>
    )
  }
}

export default CourseItem
