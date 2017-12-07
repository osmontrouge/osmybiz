const actionsInjector = require('inject-loader!../../../../../src/store/detail')

const actions = actionsInjector({
  './../api/osmApi': {
    postNote () {
      return Promise.resolve({text: 'test Address: test\n Category: test\n Name: test\n Wheelchair: true'})
    },
    getNode () {
      return Promise.resolve({
        lat: '1',
        lon: '2',
        version: '1',
        id: '1'
      })
    }
  },
  './../api/osmybizApi': {
    addOrUpdateNode () {
      return Promise.resolve()
    }
  }
})

const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

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
        {user: {}, osmId: 0},
        {
          details: {
            category: {
              text: '',
              value: 0,
              fields: [
                {name: '', value: ''}
              ]
            },
            name: '',
            opening_hours: '',
            phone: '',
            email: '',
            website: '',
            wheelchair: false,
            description: '',
            note: ''
          }
        },
        [
          { type: 'setNote', payload: { text: { address: 'test', name: 'test' } } }
        ], done)
    })
  })
})
