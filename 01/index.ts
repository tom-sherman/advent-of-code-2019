import input from './input'

const masses = input.split('\n').map(x => parseInt(x))

const fuelFromMass = (mass: number): number => Math.floor(mass / 3) - 2

const part1Solution = masses.reduce((total, mass) => total + fuelFromMass(mass), 0)

const totalFuel = (mass: number, total: number = 0): number => {
  const fuel = fuelFromMass(mass)
  if (fuel <= 0) {
    return total
  }
  return totalFuel(fuel, total + fuel)
}

const part2Solution = masses.reduce((total, mass) => total + totalFuel(mass), 0)

console.table({ part1Solution, part2Solution })
