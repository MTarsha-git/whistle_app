const { createMatch } = require('../controllers/match-controller')

jest.mock('../models', () => {
  const Match = {
    create: jest.fn(),
  }
  return { Match }
})

const db = require('../models')

// minimal response mock
const mockRes = () => {
  const res = {}
  res.status = jest.fn(() => res)
  res.json = jest.fn(() => res)
  return res
}

describe('createMatch', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns 201 with created match when insert succeeds', async () => {
    const body = {
      Date: '2026-01-20',
      Time: '10:00:00',
      CourtId: 1,
      DegreeId: 2,
      MatchType: 1,
    }
    const created = { id: 1, Date: body.Date, time: body.Time, CourtId: 1, DegreeId: 2, MatchType: 1 }
    db.Match.create.mockResolvedValue(created)

    const req = { body }
    const res = mockRes()

    await createMatch(req, res)

    expect(db.Match.create).toHaveBeenCalledWith({
      Date: body.Date,
      time: body.Time,
      CourtId: body.CourtId,
      DegreeId: body.DegreeId,
      MatchType: body.MatchType,
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(created)
  })

  it('returns 500 when create throws', async () => {
    const body = {
      Date: '2026-01-20',
      Time: '10:00:00',
      CourtId: 1,
      DegreeId: 2,
      MatchType: 1,
    }
    db.Match.create.mockRejectedValue(new Error('db failure'))

    const req = { body }
    const res = mockRes()

    await createMatch(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'db failure' })
  })
})
