const tests = [
  {id: 1, name: 'test 1'},
  {id: 2, name: 'test 2'}
]

export default {
  loadTests: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tests)
      }, 100)
    })
  }
}
