import twilio from 'twilio';
import { logger, errorLogger } from '../shared/logger';
import config from '../config';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendOtpToPhone = async (to: string, otp: number) => {
     try {
          const message = await client.messages.create({
               body: `Your BIA Serve OTP Code is: ${otp}`,
               from: config.twilio.phoneNumber,
               to: to,
          });
          console.log(11, config.twilio.phoneNumber);

          logger.info('OTP sent successfully:', message.sid);
          return message;
     } catch (error) {
          errorLogger.error('Twilio SMS Error:', error);
          throw error;
     }
};
