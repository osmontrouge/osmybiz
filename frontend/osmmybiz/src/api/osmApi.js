import axios from 'axios'

var url = 'https://master.apis.dev.openstreetmap.org/api/0.6/notes.json'

export default {

  postNote: (note) => {
    return axios.post(url, note)
      .then(response => {
        console.log(response)
      })
      .catch(e => {
        console.log(e)
      })
  }
}
