import input from './input'

const parseInput = (input: string): Memory => input.split(',').map(x => parseInt(x))

type Memory = number[]
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
    case 1: return x + y
    case 2: return x * y
    case 99: return 'halt'
  }
}

function storeValue(value: number, address: number, memory: Memory): Memory {
  const newProgram = memory.slice()
  newProgram[address] = value
  return newProgram
}

function exectuteInstruction([op, param1, param2, storePos]: Instruction, memory: Memory): InstructionResult {
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

  return currentState
}

console.log(callProgram(parseInput(input), 12, 2).memory[0])
