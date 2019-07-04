
onmessage = (event) => {
  // const result = isURL(event.data[0]);

  console.log(event.data);
  // alert('Started Webworker');
  // const answere = ['no', 'not', 'yes', 'but', 'maybe'];
  postMessage('answere');
};

