import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { Parser } from 'json2csv';

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const status = req.query.status as string;
    const source = req.query.source as string;
    const search = req.query.search as string;
    const sort = req.query.sort as string;

    const query: Record<string, unknown> = {};

    if (status) query.status = status;

    if (source) query.source = source;

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const sortOption: Record<string, 1 | -1> =
    sort === 'oldest'
      ? { createdAt: 1 }
      : { createdAt: -1 };

    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const exportCSV = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const leads = await Lead.find();

    const fields = [
      'name',
      'email',
      'status',
      'source',
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(leads);

    res.header('Content-Type', 'text/csv');

    res.attachment('leads.csv');

    res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'CSV Export Failed',
    });
  }
};