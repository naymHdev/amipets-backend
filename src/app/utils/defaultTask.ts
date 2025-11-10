import { Role } from '../modules/auth/auth.interface';
import User from '../modules/auth/auth.model';
import Pet from '../modules/pet/pet.model';

export async function defaultTask() {
  // check admin is exist
  const admin = await User.findOne({ role: Role.ADMIN });
  // delete all pets
   await Pet.deleteMany({});
  if (!admin) {
    await User.create({
      first_name: 'Mr',
      last_name: 'Mantas',
      email: 'mantaskuneika1@gmail.com',
      phoneNumber: '+8801770064053',
      password: 'mantasKuneika1@',
      role: 'admin',
      verification: {
        otp: '0',
        status: true,
      },
    });
  }
}
