import axios from 'axios'

// var oauthKey = 'deem7DGxX11rEQZ1SjYQ2lL0O9JCCNtqBzFUePjA'
// var oauthSecret = 'umPZIExDrNP4KvcXkhwBNIlH9J8jByPSCSwwL4w9'

var requestUrl = 'http://www.openstreetmap.org/oauth/request_token'

export default {
  authenticate () {
    // + '?CONSUMER_KEY=' + oauthKey + 'CONSUMER_SECRET=' + oauthSecret
    return axios.post(requestUrl, {
      crossDomain: true
    })
      .then(response => {
        console.log(response)
      })
      .catch(e => {
        console.log(e)
      })
  }
}
