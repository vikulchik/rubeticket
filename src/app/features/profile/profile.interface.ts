export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface IProfile {
  email: string;
  firstName: string;
  lastName: string;
  birthday: string | Date;
  gender: Gender;
  photoUrl?: string;
}
