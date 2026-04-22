import { expect, test } from 'vitest'
import { login } from '../src/js/api/auth.js'

test('login POST request', () => {
  expect(login({email: "bro", password: "123"})).toBe({success: false})
})