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
} from "../models/enums";
import type {
  TblUser,
  TblBranch,
  TblProgram,
  TblClass,
  TblLevel,
  TblChargeFee,
  TblStudent,
  TblTransactionAccount,
  TblReport,
} from "../models/types";

export const initializeDummyData = () => {
  // Branches
  const branches: TblBranch[] = [
    {
      id: "branch-1",
      name: "New Concept Jakarta Pusat",
      phone: "+62 21 1234567",
      description: "Main branch in Central Jakarta",
      type: BranchType.MAIN,
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      postCode: "10220",
      registerFee: 500000,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "branch-2",
      name: "New Concept Jakarta Selatan",
      phone: "+62 21 7654321",
      description: "Franchise branch in South Jakarta",
      type: BranchType.FRANCHISE,
      address: "Jl. Senopati No. 45, Jakarta Selatan",
      postCode: "12190",
      registerFee: 500000,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      deleted: false,
    },
  ];

  // Users
  const users: TblUser[] = [
    {
      id: "user-1",
      branchId: "branch-1",
      name: "Admin Pusat",
      email: "admin@newconcept.com",
      password: "admin123",
      role: UserRoles.ADMIN,
      status: UserStatus.ACTIVE,
      lastLogin: new Date(),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
      deleted: false,
    },
    {
      id: "user-2",
      branchId: "branch-1",
      name: "Manager Jakarta Pusat",
      email: "manager.pusat@newconcept.com",
      password: "manager123",
      role: UserRoles.MANAGER,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
      deleted: false,
    },
    {
      id: "user-3",
      branchId: "branch-2",
      name: "Manager Jakarta Selatan",
      email: "manager.selatan@newconcept.com",
      password: "manager123",
      role: UserRoles.MANAGER,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
      deleted: false,
    },
    {
      id: "user-4",
      branchId: "branch-1",
      name: "Staff Pusat 1",
      email: "staff1.pusat@newconcept.com",
      password: "staff123",
      role: UserRoles.STAFF,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date(),
      deleted: false,
    },
    {
      id: "user-5",
      branchId: "branch-2",
      name: "Staff Selatan 1",
      email: "staff1.selatan@newconcept.com",
      password: "staff123",
      role: UserRoles.STAFF,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date(),
      deleted: false,
    },
    {
      id: "user-6",
      branchId: "branch-1",
      name: "Ahmad Student",
      email: "ahmad@student.com",
      password: "student123",
      role: UserRoles.STUDENT,
      status: UserStatus.ACTIVE,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date(),
      deleted: false,
    },
  ];

  // Programs
  const programs: TblProgram[] = [
    {
      id: "program-1",
      key: "general-english",
      name: "General English",
      description: "General English conversation and grammar",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "program-2",
      key: "business-english",
      name: "Business English",
      description: "Professional English for business",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
  ];

  // Classes
  const classes: TblClass[] = [
    {
      id: "class-1",
      name: "Kids English",
      description: "English for children ages 6-12",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "class-2",
      name: "Teen English",
      description: "English for teenagers ages 13-17",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "class-3",
      name: "Adult English",
      description: "English for adults 18+",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
  ];

  // Levels
  const levels: TblLevel[] = [
    {
      id: "level-1",
      classId: "class-1",
      name: "Beginner",
      description: "Basic English for beginners",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "level-2",
      classId: "class-1",
      name: "Intermediate",
      description: "Intermediate level English",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "level-3",
      classId: "class-2",
      name: "Beginner",
      description: "Basic English for teens",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
  ];

  // Charge Fees
  const chargeFees: TblChargeFee[] = [
    {
      id: "fee-1",
      branchId: "branch-1",
      classId: "class-1",
      levelId: "level-1",
      charge: 1500000,
      chargeCash: 1400000,
      chargePerMonth: 500000,
      chargePer2Month: 950000,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "fee-2",
      branchId: "branch-2",
      classId: "class-1",
      levelId: "level-1",
      charge: 1500000,
      chargeCash: 1400000,
      chargePerMonth: 500000,
      chargePer2Month: 950000,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      deleted: false,
    },
  ];

  // Students
  const students: TblStudent[] = [
    {
      id: "student-1",
      userId: "user-6",
      branchId: "branch-1",
      programId: "program-1",
      classId: "class-1",
      chargeId: "fee-1",
      levelId: "level-1",
      status: StudentStatus.ACTIVE,
      registrationNumber: "NC-2024-001",
      fullName: "Ahmad Rizki",
      nickName: "Ahmad",
      title: UserTitle.MR,
      placeBirth: "Jakarta",
      dateBirth: new Date("2010-05-15"),
      gender: UserGender.MALE,
      blodGroup: UserBloodGroup.O,
      address: "Jl. Merdeka No. 10, Jakarta",
      postCode: "10110",
      phone: "+62 812 3456 7890",
      citizenship: "Indonesia",
      reportMark: "Good progress",
      school: "SD Negeri 01",
      religion: "Islam",
      class: "5A",
      hobby: "Reading, Gaming",
      organizationName: "-",
      organizationAddress: "-",
      isUnderAge: true,
      parentName: "Budi Santoso",
      parentOccupation: "Engineer",
      parentAddress: "Jl. Merdeka No. 10, Jakarta",
      studyStartTime: new Date("2024-02-01"),
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      deleted: false,
    },
  ];

  // Transaction Accounts
  const transactionAccounts: TblTransactionAccount[] = [
    {
      id: "acc-1",
      code: "4100",
      category: AccountCategory.PENDAPATAN,
      name: "Pendapatan Kursus",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
    {
      id: "acc-2",
      code: "5100",
      category: AccountCategory.BEBAN,
      name: "Beban Operasional",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      deleted: false,
    },
  ];

  // Reports
  const reports: TblReport[] = [
    {
      id: "report-1",
      accountId: "acc-1",
      userId: "user-2",
      branchId: "branch-1",
      name: "Pembayaran Kursus Ahmad",
      description: "Pembayaran bulan Februari",
      amount: 500000,
      status: TransactionStatus.SUCCESS,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      deleted: false,
    },
    {
      id: "report-2",
      accountId: "acc-2",
      userId: "user-2",
      branchId: "branch-1",
      name: "Beban Listrik",
      description: "Pembayaran listrik bulan Januari",
      amount: 1500000,
      status: TransactionStatus.SUCCESS,
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-25"),
      deleted: false,
    },
  ];

  // Save to localStorage
  localStorage.setItem("tblBranch", JSON.stringify(branches));
  localStorage.setItem("tblUser", JSON.stringify(users));
  localStorage.setItem("tblProgram", JSON.stringify(programs));
  localStorage.setItem("tblClass", JSON.stringify(classes));
  localStorage.setItem("tblLevel", JSON.stringify(levels));
  localStorage.setItem("tblChargeFee", JSON.stringify(chargeFees));
  localStorage.setItem("tblStudent", JSON.stringify(students));
  localStorage.setItem("tblTransactionAccount", JSON.stringify(transactionAccounts));
  localStorage.setItem("tblReport", JSON.stringify(reports));
  localStorage.setItem("tblAttendance", JSON.stringify([]));
  localStorage.setItem("tblLog", JSON.stringify([]));

  console.log("Dummy data initialized successfully");
};
