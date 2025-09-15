import bcrypt from 'bcrypt';
import User from '../modules/auth/auth.model';
import { Role } from '../modules/auth/auth.interface';

export async function defaultTask() {
  // Check if an admin user already exists
  const admin = await User.findOne({ role: Role.ADMIN });

  if (!admin) {
    // Create admin user if not exists
    const hashedPassword = await bcrypt.hash('112233', 10);

    await User.create({
      first_name: 'Manats',
      full_name: 'Manats',
      email: 'admin@gmail.com',
      contact_number: 1234567890,
      password: hashedPassword,
      role: Role.ADMIN,
      verification: {
        otp: '0',
        status: true,
      },
      isActive: true,
      isVerified: true,
    });
  }
}
