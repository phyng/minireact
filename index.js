
let uid = 0
let currentDispatcher = null

const makeDispatcher = () => {
  return {
    uid: uid++,
    index: 0,
    data: [],
    callbacks: [],
    callbacksResults: [],
    updater: null
  }
}

const useState = (initValue) => {
  const { index, updater, data } = currentDispatcher
  currentDispatcher.index += 1
  return [
    data[index] === undefined ? initValue : data[index],
    (value) => {
      data[index] = value
      setTimeout(() => updater())
    }
  ]
}

const useEffect = (callback) => {
  currentDispatcher.callbacks.push(callback)
}

const render = (element, component, dispatcher = null) => {
  currentDispatcher = dispatcher = dispatcher || makeDispatcher()
  for (let i = 0; i < currentDispatcher.callbacks.length; i++) {
    if (typeof currentDispatcher.callbacksResults[i] === "function") {
      currentDispatcher.callbacksResults[i]()
    }
  }
  currentDispatcher.callbacks.length = 0
  currentDispatcher.index = 0
  currentDispatcher.updater = () => {
    render(element, component, dispatcher)
  }
  const htmls = component();
  element.innerHTML = htmls.join('')
  for (let i = 0; i < currentDispatcher.callbacks.length; i++) {
    currentDispatcher.callbacksResults[i] = currentDispatcher.callbacks[i]()
  }
  currentDispatcher = null
}

const makeClass = (name) => name + '_' + Math.random().toString(36).substr(2, 9)

export {
  useState,
  useEffect,
  makeClass,
  render
}
