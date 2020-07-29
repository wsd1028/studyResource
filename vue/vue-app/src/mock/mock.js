const Mock = require('mockjs')

const login = () => {
  return {
    code: 0,
    data: {
      token: '111',
      homeUrl: '/main/home',
      projectId: '123'
    }
  }
}

// Mock.mock('/auth/a/login', 'get', login)
