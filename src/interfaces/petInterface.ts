// Define an enum for PetSex
export enum PetSex {
  Male = "male",
  Female = "female",
  Unknown = "unknown",
}

// Update the Pet interface to use the PetSex enum
export interface Pet {
  pet_id: string;
  owner_id: string;
  breed: string;
  name: string;
  birth_date: string;
  weight: string;
  kind: string;
  sex: PetSex;
}