// Copyright (c)2024 Quinn Michaels
// Gemini Deva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(gemini.me.name, () => {
  beforeEach(() => {
    return gemini.init()
  });
  it('Check the DEVA Object', () => {
    expect(gemini).to.be.an('object');
    expect(gemini).to.have.property('agent');
    expect(gemini).to.have.property('vars');
    expect(gemini).to.have.property('listeners');
    expect(gemini).to.have.property('methods');
    expect(gemini).to.have.property('modules');
  });
})
