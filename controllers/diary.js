const Diary = require("../models/Diary");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, NotFoundError } = require("../errors");

const getAll = async (req, res) => {
  const { userId } = req.user;

  const diary = await Diary.find({ createdBy: userId }).sort("date");
  res.status(StatusCodes.OK).json({ diary, length: diary.length });
};

const createDiary = async (req, res) => {
  const { userId } = req.user;
  const { title, content, date } = req.body;

  const diary = await Diary.create({ title, content, createdBy: userId });

  res.status(StatusCodes.CREATED).json({ diary });
};

const getOne = async (req, res) => {
  const { id } = req.params;

  const diary = await Diary.findOne({ _id: id });

  if (!diary) {
    throw new NotFoundError(`${id} not found`);
  }

  res.status(StatusCodes.OK).json(diary);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { title, content, date } = req.body;

  const diary = await Diary.findOneAndUpdate(
    { _id: id, createdBy: userId },
    { title, content, date },
    { new: true, runValidators: true }
  );

  if (!diary) {
    throw new NotFoundError(`${id} not found`);
  }

  res.status(StatusCodes.OK).json(diary);
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const diary = await Diary.findOneAndDelete({ _id: id, createdBy: userId });

  if (!diary) {
    throw new NotFoundError(`${id} not found`);
  }

  res.status(StatusCodes.OK).json({ message: "Diary Deleted Successfully" });
};

module.exports = {
  getAll,
  createDiary,
  getOne,
  update,
  deleteOne,
};
