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
  branchId: string | null;
  image?: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRoles;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblBranch {
  id: string;
  code: string;
  name: string;
  phone: string;
  description?: string;
  type: BranchType;
  address: string;
  postCode: string;
  registerFee: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblProgram {
  id: string;
  key: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblClass {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblLevel {
  id: string;
  classId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  chargePer2Month?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  nickName?: string;
  title?: UserTitle;
  placeBirth?: string;
  dateBirth?: string;
  gender?: UserGender;
  bloodGroup?: UserBloodGroup;
  address?: string;
  postCode?: string;
  phone?: string;
  citizenship?: string;
  reportMark?: string;
  school?: string;
  religion?: string;
  class?: string;
  hobby?: string;
  organizationName?: string;
  organizationAddress?: string;
  isUnderAge?: boolean;
  parentName?: string;
  parentOccupation?: string;
  parentAddress?: string;
  studyStartTime?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblTransactionAccount {
  id: string;
  code: string;
  category: AccountCategory;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblReport {
  id: string;
  accountId: string;
  userId: string;
  branchId: string;
  name: string;
  description?: string;
  amount: number;
  status: TransactionStatus;
  periodType?: "DAY" | "WEEK" | "MONTH" | "YEAR";
  periodKey?: string;
  finalized?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblAttendance {
  id: string;
  userId: string;
  branchId: string;
  classId?: string;
  levelId?: string;
  description?: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblVoucher {
  id: string;
  code: string;
  type: "PERCENT" | "AMOUNT";
  value: number;
  scope: "GLOBAL" | "BRANCH" | "PROGRAM" | "CLASS" | "LEVEL" | "STUDENT";
  branchId?: string;
  programId?: string;
  classId?: string;
  levelId?: string;
  studentId?: string;
  active: boolean;
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblInvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface TblInvoice {
  id: string;
  visibleNumber: string;
  branchId: string;
  studentId: string;
  chargeId?: string;
  period: string;
  dueDate?: string;
  discountVoucherId?: string;
  discountAmount?: number;
  totalAmount: number;
  status: TransactionStatus;
  paidAt?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export interface TblLog {
  id: string;
  userId: string;
  reffId?: string;
  table: string;
  method: MethodRequest;
  before?: unknown;
  after?: unknown;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deleted: boolean;
}

export type Tables = {
  tblUser: TblUser[];
  tblBranch: TblBranch[];
  tblProgram: TblProgram[];
  tblClass: TblClass[];
  tblLevel: TblLevel[];
  tblChargeFee: TblChargeFee[];
  tblStudent: TblStudent[];
  tblTransactionAccount: TblTransactionAccount[];
  tblReport: TblReport[];
  tblAttendance: TblAttendance[];
  tblVoucher: TblVoucher[];
  tblInvoice: TblInvoice[];
  tblInvoiceItem: TblInvoiceItem[];
  tblLog: TblLog[];
};
