import {
  listContacts,
  getContactById as getContactByIdService,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContactById,
} from '../services/contacts.js';
import { calculatePagination } from '../utils/pagination.js';
import { getSortOptions } from '../utils/sorting.js';
import { getFilterOptions } from '../utils/filtering.js';

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      isFavourite,
    } = req.query;

    const { contacts, total } = await listContacts(userId, {
      page,
      perPage,
      sortBy,
      sortOrder,
      isFavourite:
        isFavourite === 'true'
          ? true
          : isFavourite === 'false'
          ? false
          : undefined,
    });

    const pagination = calculatePagination({
      page,
      perPage,
      totalItems: total,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        ...pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await getContactByIdService(id, userId);
    res.json({
      status: 'success',
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await addContact({ ...req.body, userId });
    res.status(201).json({
      status: 'success',
      code: 201,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await removeContact(id, userId);
    res.json({
      status: 'success',
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await updateContactById(id, req.body, userId);
    res.json({
      status: 'success',
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const result = await updateStatusContactById(id, req.body, userId);
    res.json({
      status: 'success',
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
