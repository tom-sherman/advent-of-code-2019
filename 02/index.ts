import input from './input'

const parseInput = (input: string): Memory =>
  input.split(',').map(x => parseInt(x))

type Memory = readonly number[]
type Opcode = 1 | 2 | 99
type Instruction = [Opcode, number, number, number]
/**
 * The result of executing an opcode on some params
 */
type OpcodeResult = number | 'halt'
type InstructionResult = {
  /**
   * The new program after executing the instruction
   */
  memory: Memory
  result: OpcodeResult
}
type State = {
  memory: Memory
  instructionPointer: number
  halted: boolean
}

function executeOpcode(op: Opcode, x: number, y: number): OpcodeResult {
  switch (op) {
    case 1:
      return x + y
    case 2:
      return x * y
    case 99:
      return 'halt'
  }
}

function storeValue(value: number, address: number, memory: Memory): Memory {
  const newProgram = memory.slice()
  newProgram[address] = value
  return newProgram
}

function exectuteInstruction(
  [op, param1, param2, storePos]: Instruction,
  memory: Memory
): InstructionResult {
  const result = executeOpcode(op, memory[param1], memory[param2])
  if (result === 'halt') {
    return {
      memory,
      result
    }
  }
  return {
    memory: storeValue(result, storePos, memory),
    result
  }
}

function readInstruction(program: Memory, position: number): Instruction {
  // We have to tell the compiler it's a valid instruction
  // Maybe a type guard would work here?
  return program.slice(position, position + 4) as Instruction
}

function nextState(state: State): State {
  const instruction = readInstruction(state.memory, state.instructionPointer)
  const { memory, result } = exectuteInstruction(instruction, state.memory)
  return {
    memory,
    instructionPointer: state.instructionPointer + 4,
    halted: result === 'halt'
  }
}

function callProgram(program: Memory, noun: number, verb: number) {
  // Set noun and verb in memory
  const initialMemory = program.slice()
  initialMemory.splice(1, 1, noun)
  initialMemory.splice(2, 1, verb)

  let currentState: State = {
    memory: initialMemory,
    instructionPointer: 0,
    halted: false
  }

  while (!currentState.halted) {
    currentState = nextState(currentState)
  }

  return currentState.memory[0]
}

/**
 * Generates all possible permutations of two integers. Starting from 0, 0
 */
function* generateNums(): Generator<[number, number], void, unknown> {
  let currentCeiling = 0
  let x = 0
  let y = 0
  yield [x, y]
  while (true) {
    if (x < currentCeiling) {
      x++
      yield [x, y]
      if (x !== y) {
        yield [y, x]
      }
      continue
    }
    if (y < currentCeiling) {
      y++
      yield [x, y]
      if (x !== y) {
        yield [y, x]
      }
      continue
    }
    y = 0
    currentCeiling++
  }
}

const program = parseInput(input)

for (const [noun, verb] of generateNums()) {
  const result = callProgram(program, noun, verb)
  console.log(`
    Noun: ${noun}
    Verb: ${verb}
        = ${result}
  `)
  if (result === 19690720) {
    console.log(`Part 2 result = ${100 * noun + verb}`)
    break
  }
}
