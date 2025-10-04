export enum UserRoles {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}

export enum UserTitle {
  MR = "MR",
  MRS = "MRS",
  MISS = "MISS",
}

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum UserBloodGroup {
  O = "O",
  AB = "AB",
  A = "A",
  B = "B",
}

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  DORMAN = "DORMAN",
  INACTIVE = "INACTIVE",
}

export enum BranchType {
  MAIN = "MAIN",
  FRANCHISE = "FRANCHISE",
}

export enum AccountCategory {
  AKTIFA = "AKTIFA",
  KEWAJIBAN = "KEWAJIBAN",
  EKUITAS = "EKUITAS",
  PENDAPATAN = "PENDAPATAN",
  BEBAN = "BEBAN",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  PERMISSION = "PERMISSION",
}

export enum MethodRequest {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}
