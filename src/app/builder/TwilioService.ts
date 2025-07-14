import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import twilio from 'twilio';
import AppError from '../../errors/AppError';

interface TwilioClient {
     messages: {
          create: (params: { body: string; from: string; to: string }) => Promise<any>;
     };
}

class TwilioService {
     private client: TwilioClient;

     constructor() {
          const accountSid = config.twilio.accountSid;
          const authToken = config.twilio.authToken;
          // Initialize Twilio client
          this.client = twilio(accountSid, authToken);
     }

     async sendOTP(to: string, otp: number): Promise<void> {
          try {
               await this.client.messages.create({
                    body: `Your verification code is: ${otp}`,
                    from: config.twilio.phoneNumber,
                    to: to,
               });
          } catch (error: any) {
               throw new AppError(StatusCodes.EXPECTATION_FAILED, `Failed to send verification code: ${error.message}`);
          }
     }
}

export const twilioService = new TwilioService();
