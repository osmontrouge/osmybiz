import axios from 'axios'

let urlNote = 'https://master.apis.dev.openstreetmap.org/api/0.6/notes.json'
let urlComment = 'https://master.apis.dev.openstreetmap.org/api/0.6/notes/'

export default {

  post_Note: (note) => {
    return axios.post(urlNote, note)
      .then(response => {
        return {
          html: response.data.properties.comments[0].html,
          id: response.data.properties.id,
          status: response.data.properties.status
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  post_Comment: (id, comment) => {
    return axios.post(urlComment + id + '/comment?text=' + comment)
      .catch(e => {
        console.log(e)
      })
  }
}
