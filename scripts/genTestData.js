// This little utility code generates apply.json and transform.json for use
// testing text OT implementations in other languages without needing to port
// the test suite.

require('coffeescript/register')

const fs = require('fs')
const assert = require('assert')

const fuzzer = require('ot-fuzzer')
const type = require('../lib').type
const genOp = require('../test/genOp')

if (require.main === module) {
  const t = Object.assign({}, type)

  console.log('Generating apply.json, transform.json and compose.json')
  const af = fs.createWriteStream('apply.json')
  const tf = fs.createWriteStream('transform.json')
  const cf = fs.createWriteStream('compose.json')
  
  t.apply = (str, op) => {
    const result = type.apply(str, op)
    af.write(`${JSON.stringify({str, op, result})}\n`)
    return result
  }

  t.transform = (op, otherOp, side) => {
    const result = type.transform(op, otherOp, side)
    tf.write(`${JSON.stringify({op, otherOp, side, result})}\n`)
    return result
  }

  t.compose = (op1, op2) => {
    const result = type.compose(op1, op2)
    cf.write(`${JSON.stringify({op1, op2, result})}\n`)
    return result
  }

  fuzzer(t, genOp, 200)

  af.close()
  tf.close()
}
