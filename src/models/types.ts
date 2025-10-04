import {
  UserRoles,
  UserStatus,
  UserTitle,
  UserGender,
  UserBloodGroup,
  StudentStatus,
  BranchType,
  AccountCategory,
  TransactionStatus,
  AttendanceStatus,
  MethodRequest,
} from "./enums";

// Re-export enums for convenience
export {
  UserRoles,
  UserStatus,
  UserTitle,
  UserGender,
  UserBloodGroup,
  StudentStatus,
  BranchType,
  AccountCategory,
  TransactionStatus,
  AttendanceStatus,
  MethodRequest,
};

export interface TblUser {
  id: string;
  branchId: string;
  image?: string;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblBranch {
  id: string;
  name: string;
  phone: string;
  description: string;
  type: BranchType;
  address: string;
  postCode: string;
  registerFee: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblProgram {
  id: string;
  key: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblClass {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblLevel {
  id: string;
  classId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblChargeFee {
  id: string;
  branchId: string;
  classId: string;
  levelId: string;
  charge: number;
  chargeCash: number;
  chargePerMonth: number;
  chargePer2Month: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblStudent {
  id: string;
  userId: string;
  branchId: string;
  programId: string;
  classId: string;
  chargeId: string;
  levelId: string;
  status: StudentStatus;
  registrationNumber: string;
  imageProfile?: string;
  fullName: string;
  nickName: string;
  title: UserTitle;
  placeBirth: string;
  dateBirth: Date;
  gender: UserGender;
  blodGroup: UserBloodGroup;
  address: string;
  postCode: string;
  phone: string;
  citizenship: string;
  reportMark: string;
  school: string;
  religion: string;
  class: string;
  hobby: string;
  organizationName: string;
  organizationAddress: string;
  isUnderAge: boolean;
  parentName?: string;
  parentOccupation?: string;
  parentAddress?: string;
  studyStartTime: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblTransactionAccount {
  id: string;
  code: string;
  category: AccountCategory;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblReport {
  id: string;
  accountId: string;
  userId: string;
  branchId: string;
  name: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblAttendance {
  id: string;
  userId: string;
  branchId: string;
  classId: string;
  levelId: string;
  description: string;
  clockIn: Date;
  clockOut?: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface TblLog {
  id: string;
  userId: string;
  reffId: string;
  table: string;
  method: MethodRequest;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}
