const { createRefereeEvaluation } = require('../controllers/refereeEvaluation-controller');

jest.mock('../models', () => {
  const User = {
    findByPk: jest.fn(),
  };
  const Match = {
    findByPk: jest.fn(),
  };
  const Assignment = {
    findOne: jest.fn(),
  };
  const RefereeEvaluation = {
    findOne: jest.fn(),
    create: jest.fn(),
  };
  return { User, Match, Assignment, RefereeEvaluation };
});

const db = require('../models');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('createRefereeEvaluation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 and creates a new evaluation when request is valid', async () => {
    const req = {
      body: {
        UserId: 5,
        MatchId: 11,
        Evaluation: 4,
        description: 'Solid performance',
      },
    };
    const res = mockRes();

    db.User.findByPk.mockResolvedValue({ id: req.body.UserId });
    db.Match.findByPk.mockResolvedValue({ id: req.body.MatchId });
    db.Assignment.findOne.mockResolvedValue({ id: 1, UserId: 5, MatchId: 11 });
    db.RefereeEvaluation.findOne.mockResolvedValue(null);
    const createdEvaluation = {
      id: 7,
      ...req.body,
    };
    db.RefereeEvaluation.create.mockResolvedValue(createdEvaluation);

    await createRefereeEvaluation(req, res);

    expect(db.User.findByPk).toHaveBeenCalledWith(5);
    expect(db.Match.findByPk).toHaveBeenCalledWith(11);
    expect(db.Assignment.findOne).toHaveBeenCalledWith({ where: { UserId: 5, MatchId: 11 } });
    expect(db.RefereeEvaluation.findOne).toHaveBeenCalledWith({ where: { UserId: 5, MatchId: 11 } });
    expect(db.RefereeEvaluation.create).toHaveBeenCalledWith({
      UserId: 5,
      MatchId: 11,
      Evaluation: 4,
      description: 'Solid performance',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdEvaluation);
  });

  it('returns 400 when required fields are missing', async () => {
    const req = {
      body: {
        UserId: 5,
        MatchId: 11,
      },
    };
    const res = mockRes();

    await createRefereeEvaluation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'UserId, MatchId and Evaluation are required.' });
  });

  it('returns 404 when the user does not exist', async () => {
    const req = {
      body: {
        UserId: 5,
        MatchId: 11,
        Evaluation: 3,
      },
    };
    const res = mockRes();

    db.User.findByPk.mockResolvedValue(null);

    await createRefereeEvaluation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
  });

  it('returns 400 when the user is not assigned to the match', async () => {
    const req = {
      body: {
        UserId: 5,
        MatchId: 11,
        Evaluation: 3,
      },
    };
    const res = mockRes();

    db.User.findByPk.mockResolvedValue({ id: req.body.UserId });
    db.Match.findByPk.mockResolvedValue({ id: req.body.MatchId });
    db.Assignment.findOne.mockResolvedValue(null);

    await createRefereeEvaluation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User is not assigned as a referee for this match.' });
  });

  it('executes within acceptable time when run repeatedly', async () => {
    const req = {
      body: {
        UserId: 5,
        MatchId: 11,
        Evaluation: 4,
        description: 'Performance test',
      },
    };
    const res = mockRes();

    db.User.findByPk.mockResolvedValue({ id: req.body.UserId });
    db.Match.findByPk.mockResolvedValue({ id: req.body.MatchId });
    db.Assignment.findOne.mockResolvedValue({ id: 1, UserId: 5, MatchId: 11 });
    db.RefereeEvaluation.findOne.mockResolvedValue(null);
    db.RefereeEvaluation.create.mockResolvedValue({ id: 7, ...req.body });

    const runs = 20;
    const start = process.hrtime.bigint();

    for (let i = 0; i < runs; i += 1) {
      await createRefereeEvaluation(req, res);
    }

    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    expect(durationMs).toBeLessThan(500);
  });
});
