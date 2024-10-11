import '../../loadEnvironment';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../errors/CustomError';
import { ActivityLog, WebConsultCount, WhatsappCount } from '../../database/models/ActivityLog';
import { SessionLog } from '../../database/models/SessionLog';
import { UserLogs } from '../../database/models/UserLog';

export const getWhatsappLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await WhatsappCount.find();
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        const finalError = new CustomError(
            500,
            "Error retrieving whatsapp click logs.",
            `Error retrieving whatsapp click logs. ${error}.`
        );
        next(finalError);
    }
};


export const logWhatsappClick = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const dateString = today.getDate().toString();
    const monthString = today.toLocaleString('default', { month: 'long' });

    const monthLog = await WhatsappCount.findOne({ month: monthString });

    if (monthLog) {
      const dayLog = monthLog.days.find((day) => day.day === dateString);

      if (dayLog) {
        dayLog.count += 1;
      } else {
        monthLog.days.push({ day: dateString, timestamp: today, count: 1 });
      }
      await monthLog.save();
    } else {
      const newLog = new WhatsappCount({
        month: monthString,
        days: [{ day: dateString, timestamp: today, count: 1 }],
      });
      await newLog.save();
    }

    res.status(200).json({ message: 'Whatsapp click logged successfully.' });
  } catch (error) {
    console.error(error);
    const finalError = new CustomError(500, 'Error logging whatsapp Click.', `Error logging whatsapp Click. ${error}.`);
    next(finalError);
  }
};

export const logWebConsult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const dateString = today.getDate().toString();
    const monthString = today.toLocaleString('default', { month: 'long' });

    const monthLog = await WebConsultCount.findOne({ month: monthString });

    if (monthLog) {
      const dayLog = monthLog.days.find((day) => day.day === dateString);

      if (dayLog) {
        dayLog.count += 1;
      } else {
        monthLog.days.push({ day: dateString, timestamp: today, count: 1 });
      }
      await monthLog.save();
    } else {
      const newLog = new WebConsultCount({
        month: monthString,
        days: [{ day: dateString, timestamp: today, count: 1 }],
      });
      await newLog.save();
    }

    res.status(200).json({ message: 'Web consult logged successfully.' });
  } catch (error) {
    console.error(error);
    const finalError = new CustomError(500, 'Error logging web consult.', `Error logging web consult. ${error}.`);
    next(finalError);
  }
};

export const logActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId, region } = req.body;

    const userIP = (req.headers['x-forwarded-for'] as string) || req.connection.remoteAddress;

    const newActivityLog = new ActivityLog({
      message,
      sessionId,
      userId: userIP,
      timestamp: new Date(),
    });

    await newActivityLog.save();

    let sessionLog = await SessionLog.findOne({ sessionId });
    if (!sessionLog) {
      sessionLog = new SessionLog({
        sessionId,
        userId: userIP,
        timestamp: newActivityLog.timestamp,
        activityLogs: [newActivityLog],
      });
      await sessionLog.save();
    } else {
      sessionLog.activityLogs.push(newActivityLog);
      await sessionLog.save();
    }

    let userLogs = await UserLogs.findOneAndUpdate(
      { userId: userIP },
      { $set: { lastActivity: new Date(), CCAA: region } },
      { new: true, upsert: true }
    );

    if (!userLogs) {
      userLogs = new UserLogs({
        userId: userIP,
        sessionLogs: [sessionLog],
        lastActivity: new Date(),
        CCAA: region,
      });
      await userLogs.save();
    } else {
      const existingSessionLogs = await SessionLog.find({
        _id: { $in: userLogs.sessionLogs },
      });
      const sessionExists = existingSessionLogs.some((log) => log.sessionId === sessionId);
      if (!sessionExists) {
        userLogs.sessionLogs.push(sessionLog);
        await userLogs.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
    });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error logging activity.',
      `Error logging activity.
            ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const getAllUserLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await UserLogs.find({});
    res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error loading logs.',
      `Error loading logs.
            ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const getSessionLogsFromUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const sessionLogs = await SessionLog.find({ userId });
    res.status(200).json(sessionLogs);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error loading logs.',
      `Error loading session log from user id.
            ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};

export const getActivityLogsFromSessionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;

    const activityLogs = await ActivityLog.find({ sessionId });
    res.status(200).json(activityLogs);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error loading logs.',
      `Error loading activity logs from session id.
            ${error}.
            
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
};
