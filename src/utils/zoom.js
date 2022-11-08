import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

axios.defaults.baseURL = BASE_URL

const createZoomMeeting = async (start_time, duration) => {
  await axios.post('/zoom/create_meeting', { start_time, duration })
}

export { createZoomMeeting }
