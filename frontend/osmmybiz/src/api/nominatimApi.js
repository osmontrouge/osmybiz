import axios from 'axios'

var url = 'https://nominatim.openstreetmap.org/search?format=json&q='

export default {

  loadAddress: (address) => {
    return axios.get(url + address)
        .catch(e => {
          console.log(e)
        })
  }
}
