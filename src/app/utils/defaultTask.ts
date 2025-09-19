import { Role } from '../modules/auth/auth.interface';
import User from '../modules/auth/auth.model';

export async function defaultTask() {
  // check admin is exist
  const admin = await User.findOne({ role: Role.ADMIN });
  if (!admin) {
    await User.create({
      first_name: 'MD Naym',
      last_name: 'Hossen',
      email: 'mantaskuneika1@gmail.com',
      phoneNumber: '+8801770064053',
      password: 'mantaskuneika1@',
      role: 'admin',
      verification: {
        otp: '0',
        status: true,
      },
    });
  }
}
