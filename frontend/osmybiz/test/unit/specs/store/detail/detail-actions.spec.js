const actionsInjector = require('inject-loader!../../../../../src/store/detail')

const actions = actionsInjector({
  './../api/osmApi': {
    post_Note () {
      return new Promise(resolve => {
        resolve({test: 'test'})
      })
    }
  }
})

const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    console.log('commit')

    try {
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  action({ commit: commit, state: state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('detail store', () => {
  describe('actions', () => {
    it('should post note', done => {
      testAction(actions.default.actions.postNote,
        null,
        {
          details: {
            category: {
              text: '',
              value: 0
            },
            name: '',
            openinghours: '',
            phonenumber: '',
            email: '',
            website: '',
            wheelchair: false,
            description: '',
            note: ''
          }
        },
        [
          { type: 'setNote', payload: { test: 'test' } }
        ], done)
    })
  })
})
