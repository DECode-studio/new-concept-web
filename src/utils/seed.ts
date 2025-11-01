import {
  TblAttendance,
  TblBranch,
  TblChargeFee,
  TblClass,
  TblInvoice,
  TblInvoiceItem,
  TblLevel,
  TblLog,
  TblProgram,
  TblReport,
  TblStudent,
  TblTransactionAccount,
  TblUser,
  TblVoucher,
} from "@/models/types";
import {
  UserRoles,
  UserStatus,
  BranchType,
  StudentStatus,
  AccountCategory,
  TransactionStatus,
  AttendanceStatus,
  MethodRequest,
} from "@/models/enums";
import { hashPassword, generateSalt } from "@/utils/crypto";
import { uuidv7 } from "@/utils/id";
import { nowISO } from "@/utils/time";
import { writeStorage, getFlag, setFlag } from "@/utils/storage";

const seededFlagKey = "seeded";

interface SeedUserInput {
  branchId: string | null;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  status?: UserStatus;
}

const isBrowser = () => typeof window !== "undefined";

const createUserRecords = async (users: SeedUserInput[]): Promise<TblUser[]> => {
  const now = nowISO();

  return Promise.all(
    users.map(async ({ branchId, name, email, password, role, status = UserStatus.ACTIVE }) => {
      const id = uuidv7();
      const salt = generateSalt();
      const passwordHash = await hashPassword(password, salt);
      return {
        id,
        branchId,
        name,
        email,
        passwordHash,
        salt,
        role,
        status,
        createdAt: now,
        updatedAt: now,
        deleted: false,
      } satisfies TblUser;
    }),
  );
};

const mapUsersByEmail = (users: TblUser[]) =>
  users.reduce<Record<string, TblUser>>((acc, user) => {
    acc[user.email] = user;
    return acc;
  }, {});

export const seedDatabase = async (force = false) => {
  if (!isBrowser()) return;
  if (!force && getFlag(seededFlagKey)) return;

  const now = nowISO();

  const branches: TblBranch[] = [
    {
      id: uuidv7(),
      code: "JKT-PUS",
      name: "New Concept Jakarta Pusat",
      phone: "+62 21 1234567",
      description: "Main branch in Central Jakarta",
      type: BranchType.MAIN,
      address: "Jl. Sudirman No.123, Jakarta Pusat",
      postCode: "10220",
      registerFee: 500000,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      code: "JKT-SEL",
      name: "New Concept Jakarta Selatan",
      phone: "+62 21 7654321",
      description: "Franchise branch in South Jakarta",
      type: BranchType.FRANCHISE,
      address: "Jl. Senopati No.45, Jakarta Selatan",
      postCode: "12190",
      registerFee: 450000,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const [branchPusat, branchSelatan] = branches;

  const userInputs: SeedUserInput[] = [
    {
      branchId: null,
      name: "Admin Pusat",
      email: "admin@newconcept.com",
      password: "admin123",
      role: UserRoles.ADMIN,
    },
    {
      branchId: branchPusat.id,
      name: "Manager Jakarta Pusat",
      email: "manager.pusat@newconcept.com",
      password: "manager123",
      role: UserRoles.MANAGER,
    },
    {
      branchId: branchSelatan.id,
      name: "Manager Jakarta Selatan",
      email: "manager.selatan@newconcept.com",
      password: "manager123",
      role: UserRoles.MANAGER,
    },
    {
      branchId: branchPusat.id,
      name: "Staff Pusat 1",
      email: "staff1.pusat@newconcept.com",
      password: "staff123",
      role: UserRoles.STAFF,
    },
    {
      branchId: branchPusat.id,
      name: "Staff Pusat 2",
      email: "staff2.pusat@newconcept.com",
      password: "staff123",
      role: UserRoles.STAFF,
    },
    {
      branchId: branchSelatan.id,
      name: "Staff Selatan 1",
      email: "staff1.selatan@newconcept.com",
      password: "staff123",
      role: UserRoles.STAFF,
    },
    {
      branchId: branchSelatan.id,
      name: "Staff Selatan 2",
      email: "staff2.selatan@newconcept.com",
      password: "staff123",
      role: UserRoles.STAFF,
    },
  ];

  const studentNames = [
    "Ahmad Rizki",
    "Putri Ayu",
    "Budi Santoso",
    "Siti Rahma",
    "Rangga Saputra",
    "Dewi Lestari",
    "Andi Pratama",
    "Indah Permata",
    "Rudi Hartono",
    "Melati Sari",
  ];

  studentNames.forEach((name, index) => {
    const email = `${name.split(" ").join(".").toLowerCase()}@student.com`;
    const branchId = index % 2 === 0 ? branchPusat.id : branchSelatan.id;
    userInputs.push({
      branchId,
      name,
      email,
      password: "student123",
      role: UserRoles.STUDENT,
    });
  });

  const users = await createUserRecords(userInputs);
  const userMap = mapUsersByEmail(users);

  const programs: TblProgram[] = [
    {
      id: uuidv7(),
      key: "general-english",
      name: "General English",
      description: "Grammar and conversation for daily use",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      key: "business-english",
      name: "Business English",
      description: "Professional English for corporate needs",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const [generalProgram, businessProgram] = programs;

  const classes: TblClass[] = [
    {
      id: uuidv7(),
      name: "Kids English",
      description: "Ages 6-12",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      name: "Teens English",
      description: "Ages 13-17",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      name: "Adult English",
      description: "Ages 18+",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const [kidsClass, teensClass, adultClass] = classes;

  const levels: TblLevel[] = [
    {
      id: uuidv7(),
      classId: kidsClass.id,
      name: "Beginner",
      description: "Basic foundation for kids",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      classId: kidsClass.id,
      name: "Intermediate",
      description: "Intermediate curriculum for kids",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      classId: teensClass.id,
      name: "Upper Intermediate",
      description: "Advanced material for teenagers",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      classId: adultClass.id,
      name: "Professional",
      description: "Business focus for adults",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const [kidsBeginner, kidsIntermediate, teensUpper, adultProfessional] = levels;

  const chargeFees: TblChargeFee[] = [
    {
      id: uuidv7(),
      branchId: branchPusat.id,
      classId: kidsClass.id,
      levelId: kidsBeginner.id,
      charge: 500000,
      chargeCash: 450000,
      chargePerMonth: 500000,
      chargePer2Month: 950000,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      branchId: branchSelatan.id,
      classId: kidsClass.id,
      levelId: kidsBeginner.id,
      charge: 480000,
      chargeCash: 430000,
      chargePerMonth: 480000,
      chargePer2Month: 920000,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      branchId: branchPusat.id,
      classId: adultClass.id,
      levelId: adultProfessional.id,
      charge: 1200000,
      chargeCash: 1100000,
      chargePerMonth: 1200000,
      chargePer2Month: 2300000,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      branchId: branchSelatan.id,
      classId: adultClass.id,
      levelId: adultProfessional.id,
      charge: 1150000,
      chargeCash: 1080000,
      chargePerMonth: 1150000,
      chargePer2Month: 2200000,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const branchByIndex = (index: number) => (index % 2 === 0 ? branchPusat : branchSelatan);
  const programByIndex = (index: number) => (index % 2 === 0 ? generalProgram : businessProgram);
  const levelByIndex = (index: number) => {
    switch (index % 4) {
      case 0:
        return kidsBeginner;
      case 1:
        return kidsIntermediate;
      case 2:
        return teensUpper;
      default:
        return adultProfessional;
    }
  };

  const students: TblStudent[] = studentNames.map((fullName, index) => {
    const email = `${fullName.split(" ").join(".").toLowerCase()}@student.com`;
    const user = userMap[email];
    const branch = branchByIndex(index);
    const program = programByIndex(index);
    const level = levelByIndex(index);
    const charge = chargeFees.find(
      (fee) => fee.branchId === branch.id && fee.levelId === level.id,
    );

    const createdAt = now;

  return {
      id: uuidv7(),
      userId: user.id,
      branchId: branch.id,
      programId: program.id,
      classId: level.classId,
      chargeId: charge ? charge.id : chargeFees[0].id,
      levelId: level.id,
      status: StudentStatus.ACTIVE,
      registrationNumber: `NC-${branch.code}-${(index + 1).toString().padStart(3, "0")}`,
      fullName,
      nickName: fullName.split(" ")[0],
      dateBirth: new Date(2010, index % 12, (index + 5) % 28 + 1).toISOString(),
      address: `Jl. Pendidikan No.${10 + index}, Jakarta`,
      postCode: branch.postCode,
      phone: `+62 812 34${(index + 10).toString().padStart(4, "0")}`,
      citizenship: "Indonesia",
      reportMark: "Good progress",
      school: index % 2 === 0 ? "SD Negeri 01" : "SMP Negeri 02",
      class: index % 2 === 0 ? "5A" : "8B",
      hobby: index % 2 === 0 ? "Reading" : "Music",
      isUnderAge: index < 6,
      parentName: index < 6 ? `Orang Tua ${fullName.split(" ")[0]}` : undefined,
      studyStartTime: new Date(2024, index % 6, 1).toISOString(),
      createdAt,
      updatedAt: createdAt,
      deleted: false,
    } satisfies TblStudent;
  });

  const transactionAccounts: TblTransactionAccount[] = [
    {
      id: uuidv7(),
      code: "4100",
      category: AccountCategory.PENDAPATAN,
      name: "Pendapatan Kursus",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      code: "5100",
      category: AccountCategory.BEBAN,
      name: "Beban Operasional",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      code: "4200",
      category: AccountCategory.PENDAPATAN,
      name: "Pendapatan Registrasi",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const vouchers: TblVoucher[] = [
    {
      id: uuidv7(),
      code: "NCWELCOME",
      type: "PERCENT",
      value: 10,
      scope: "GLOBAL",
      active: true,
      startAt: new Date(2024, 0, 1).toISOString(),
      endAt: new Date(2024, 11, 31).toISOString(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      code: "NCJKT50K",
      type: "AMOUNT",
      value: 50000,
      scope: "BRANCH",
      branchId: branchSelatan.id,
      active: true,
      startAt: new Date(2024, 2, 1).toISOString(),
      endAt: new Date(2024, 5, 30).toISOString(),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const incomeAccount = transactionAccounts.find((acc) => acc.code === "4100")!;
  const registerAccount = transactionAccounts.find((acc) => acc.code === "4200")!;
  const expenseAccount = transactionAccounts.find((acc) => acc.code === "5100")!;

  const reports: TblReport[] = [
    {
      id: uuidv7(),
      accountId: incomeAccount.id,
      userId: userMap["manager.pusat@newconcept.com"].id,
      branchId: branchPusat.id,
      name: "Pendapatan Kursus Februari",
      amount: 5500000,
      status: TransactionStatus.SUCCESS,
      description: "Pembayaran kursus siswa Februari",
      periodType: "MONTH",
      periodKey: "2024-02",
      finalized: true,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      accountId: expenseAccount.id,
      userId: userMap["staff1.pusat@newconcept.com"].id,
      branchId: branchPusat.id,
      name: "Beban Listrik Februari",
      amount: -1200000,
      status: TransactionStatus.SUCCESS,
      description: "Tagihan listrik cabang pusat",
      periodType: "MONTH",
      periodKey: "2024-02",
      finalized: false,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      accountId: incomeAccount.id,
      userId: userMap["manager.selatan@newconcept.com"].id,
      branchId: branchSelatan.id,
      name: "Pendapatan Kursus Februari",
      amount: 4100000,
      status: TransactionStatus.SUCCESS,
      description: "Pembayaran kursus cabang selatan",
      periodType: "MONTH",
      periodKey: "2024-02",
      finalized: true,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      accountId: registerAccount.id,
      userId: userMap["staff1.selatan@newconcept.com"].id,
      branchId: branchSelatan.id,
      name: "Pendapatan Registrasi Maret",
      amount: 900000,
      status: TransactionStatus.PENDING,
      description: "Pendaftaran siswa baru",
      periodType: "MONTH",
      periodKey: "2024-03",
      finalized: false,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  const attendance: TblAttendance[] = students.slice(0, 6).map((student, index) => {
    const user = users.find((u) => u.id === student.userId)!;
    return {
      id: uuidv7(),
      userId: user.id,
      branchId: student.branchId,
      classId: student.classId,
      levelId: student.levelId,
      description: "Regular class",
      clockIn: new Date(2024, 1, index + 1, 8, 0, 0).toISOString(),
      clockOut: new Date(2024, 1, index + 1, 10, 0, 0).toISOString(),
      status: AttendanceStatus.PRESENT,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    } satisfies TblAttendance;
  });

  const invoices: TblInvoice[] = [];
  const invoiceItems: TblInvoiceItem[] = [];

  const addInvoice = ({
    student,
    branch,
    createdByEmail,
    period,
    voucher,
    items,
  }: {
    student: TblStudent;
    branch: TblBranch;
    createdByEmail: string;
    period: string;
    voucher?: TblVoucher;
    items: Array<{ description: string; qty: number; price: number }>;
  }) => {
    const invoiceId = uuidv7();
    const visibleNumber = `INV-${branch.code}-${period.replace("-", "")}-${(invoices.length + 1)
      .toString()
      .padStart(4, "0")}`;
    const createdAt = nowISO();

    const mappedItems = items.map((item) => ({
      id: uuidv7(),
      invoiceId,
      description: item.description,
      qty: item.qty,
      price: item.price,
      subtotal: item.qty * item.price,
    } satisfies TblInvoiceItem));

    const totalBefore = mappedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const discountAmount = voucher
      ? voucher.type === "PERCENT"
        ? Math.round(totalBefore * (voucher.value / 100))
        : voucher.value
      : 0;
    const totalAmount = Math.max(totalBefore - discountAmount, 0);

    invoices.push({
      id: invoiceId,
      visibleNumber,
      branchId: branch.id,
      studentId: student.id,
      chargeId: student.chargeId,
      period,
      dueDate: new Date(2024, 2, 10).toISOString(),
      discountVoucherId: voucher?.id,
      discountAmount: discountAmount || undefined,
      totalAmount,
      status: TransactionStatus.SUCCESS,
      paidAt: new Date(2024, 2, 5).toISOString(),
      notes: "Paid in full",
      createdBy: userMap[createdByEmail].id,
      createdAt,
      updatedAt: createdAt,
      deleted: false,
    });

    invoiceItems.push(...mappedItems);
  };

  addInvoice({
    student: students[0],
    branch: branchPusat,
    createdByEmail: "staff1.pusat@newconcept.com",
    period: "2024-02",
    items: [
      { description: "Tuition Fee", qty: 1, price: 500000 },
      { description: "Registration", qty: 1, price: 500000 },
    ],
  });

  addInvoice({
    student: students[1],
    branch: branchSelatan,
    createdByEmail: "staff1.selatan@newconcept.com",
    period: "2024-02",
    voucher: vouchers[0],
    items: [
      { description: "Tuition Fee", qty: 1, price: 480000 },
      { description: "Materials", qty: 1, price: 120000 },
    ],
  });

  addInvoice({
    student: students[2],
    branch: branchPusat,
    createdByEmail: "manager.pusat@newconcept.com",
    period: "2024-03",
    items: [
      { description: "Tuition Fee", qty: 1, price: 500000 },
      { description: "Materials", qty: 1, price: 100000 },
    ],
  });

  addInvoice({
    student: students[3],
    branch: branchSelatan,
    createdByEmail: "manager.selatan@newconcept.com",
    period: "2024-03",
    voucher: vouchers[1],
    items: [
      { description: "Tuition Fee", qty: 1, price: 480000 },
      { description: "Lab Fee", qty: 1, price: 80000 },
    ],
  });

  const logs: TblLog[] = [
    {
      id: uuidv7(),
      userId: userMap["admin@newconcept.com"].id,
      table: "tblBranch",
      method: MethodRequest.CREATE,
      after: branches,
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
    {
      id: uuidv7(),
      userId: userMap["admin@newconcept.com"].id,
      table: "tblUser",
      method: MethodRequest.CREATE,
      after: users.map((user) => ({ id: user.id, role: user.role, email: user.email })),
      createdAt: now,
      updatedAt: now,
      deleted: false,
    },
  ];

  writeStorage("tblBranch", branches);
  writeStorage("tblUser", users);
  writeStorage("tblProgram", programs);
  writeStorage("tblClass", classes);
  writeStorage("tblLevel", levels);
  writeStorage("tblChargeFee", chargeFees);
  writeStorage("tblStudent", students);
  writeStorage("tblTransactionAccount", transactionAccounts);
  writeStorage("tblVoucher", vouchers);
  writeStorage("tblReport", reports);
  writeStorage("tblAttendance", attendance);
  writeStorage("tblInvoice", invoices);
  writeStorage("tblInvoiceItem", invoiceItems);
  writeStorage("tblLog", logs);

  setFlag(seededFlagKey, true);
};
