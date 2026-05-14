import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;
}

export class UnsubscribeDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export interface SubscriberItem {
  id: string;
  email: string;
  confirmedAt: Date | null;
  createdAt: Date;
  isConfirmed: boolean;
}

export interface SubscribeResult {
  message: string;
  alreadySubscribed: boolean;
}