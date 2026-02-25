// Global mocks for jsdom environment

// scrollIntoView is not implemented in jsdom
Element.prototype.scrollIntoView = jest.fn()

// alert is not implemented in jsdom
global.alert = jest.fn()
