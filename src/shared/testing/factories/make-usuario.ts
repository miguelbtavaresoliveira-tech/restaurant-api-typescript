import { faker } from '@faker-js/faker'
import { Role, User } from '@prisma/client'

// Recebe dados opcionais para sobrescrever os fakes quando necessário
export function makeUsuario(override: Partial<User> = {}): User {
  return {
    id: faker.number.int({ min: 1, max: 9999 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
    role: Role.CUSTOMER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override, // Permite sobrescrever qualquer campo
  }
}