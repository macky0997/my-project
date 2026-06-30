export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required'
  }
  return undefined
}

export const email = (value) => {
  if (!value) return undefined
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address'
  }
  return undefined
}

export const phone = (value) => {
  if (!value) return undefined
  const phoneRegex = /^(09|\+639)\d{9}$/
  if (!phoneRegex.test(value.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number'
  }
  return undefined
}

export const minLength = (min) => (value) => {
  if (!value) return undefined
  if (value.length < min) {
    return `Must be at least ${min} characters`
  }
  return undefined
}

export const composeValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return undefined
}
