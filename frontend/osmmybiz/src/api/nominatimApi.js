import axios from 'axios'

var url = 'https://nominatim.openstreetmap.org/search?format=json&q='

export default {

  loadAddress: (address) => {
    return new Promise((resolve) => {
      axios.get(url + address)
        .then(response => {
          console.log(response)
          resolve(response)
        })
        .catch(e => {
          console.log(e)
        })
    })
  }
}
