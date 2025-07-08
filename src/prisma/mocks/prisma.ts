const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn()
    }
}

export default mockPrisma;