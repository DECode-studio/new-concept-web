import { makeAutoObservable } from "mobx";

import type { Tables } from "@/models/types";
import { BroadcastManager } from "@/utils/broadcast";
import { seedDatabase } from "@/utils/seed";

import { AuthStore } from "./AuthStoreImpl";
import { UserStore } from "./UserStore";
import { BranchStore } from "./BranchStore";
import { ProgramStore } from "./ProgramStore";
import { ClassStore } from "./ClassStore";
import { LevelStore } from "./LevelStore";
import { ChargeFeeStore } from "./ChargeFeeStore";
import { StudentStore } from "./StudentStore";
import { AccountStore } from "./AccountStore";
import { ReportStore } from "./ReportStore";
import { AttendanceStore } from "./AttendanceStore";
import { InvoiceStore } from "./InvoiceStore";
import { VoucherStore } from "./VoucherStore";
import { LogStore } from "./LogStore";

export class RootStore {
  readonly logStore: LogStore;
  readonly authStore: AuthStore;
  readonly userStore: UserStore;
  readonly branchStore: BranchStore;
  readonly programStore: ProgramStore;
  readonly classStore: ClassStore;
  readonly levelStore: LevelStore;
  readonly chargeFeeStore: ChargeFeeStore;
  readonly studentStore: StudentStore;
  readonly accountStore: AccountStore;
  readonly reportStore: ReportStore;
  readonly attendanceStore: AttendanceStore;
  readonly invoiceStore: InvoiceStore;
  readonly voucherStore: VoucherStore;

  ready = false;
  private broadcast: BroadcastManager | null = null;

  constructor() {
    makeAutoObservable(this, { notifyChange: false }, { autoBind: true });

    this.logStore = new LogStore(this as RootStore);
    this.authStore = new AuthStore(this as RootStore);
    this.userStore = new UserStore(this as RootStore);
    this.branchStore = new BranchStore(this as RootStore);
    this.programStore = new ProgramStore(this as RootStore);
    this.classStore = new ClassStore(this as RootStore);
    this.levelStore = new LevelStore(this as RootStore);
    this.chargeFeeStore = new ChargeFeeStore(this as RootStore);
    this.studentStore = new StudentStore(this as RootStore);
    this.accountStore = new AccountStore(this as RootStore);
    this.reportStore = new ReportStore(this as RootStore);
    this.attendanceStore = new AttendanceStore(this as RootStore);
    this.invoiceStore = new InvoiceStore(this as RootStore);
    this.voucherStore = new VoucherStore(this as RootStore);
  }

  async initialize() {
    if (this.ready) return;
    await seedDatabase();

    this.branchStore.load();
    this.userStore.load();
    this.programStore.load();
    this.classStore.load();
    this.levelStore.load();
    this.chargeFeeStore.load();
    this.studentStore.load();
    this.accountStore.load();
    this.reportStore.load();
    this.attendanceStore.load();
    this.invoiceStore.load();
    this.voucherStore.load();
    this.logStore.load();

    this.authStore.hydrate();

    if (typeof window !== "undefined") {
      this.broadcast = new BroadcastManager("nc:sync");
      this.broadcast.subscribe((payload) => {
        if (payload.action === "storage:update") {

          const table = payload.data as keyof Tables | undefined;
          switch (table) {
            case "tblBranch":
              this.branchStore.load();
              break;
            case "tblUser":
              this.userStore.load();
              break;
            case "tblProgram":
              this.programStore.load();
              break;
            case "tblClass":
              this.classStore.load();
              break;
            case "tblLevel":
              this.levelStore.load();
              break;
            case "tblChargeFee":
              this.chargeFeeStore.load();
              break;
            case "tblStudent":
              this.studentStore.load();
              break;
            case "tblTransactionAccount":
              this.accountStore.load();
              break;
            case "tblReport":
              this.reportStore.load();
              break;
            case "tblAttendance":
              this.attendanceStore.load();
              break;
            case "tblInvoice":
            case "tblInvoiceItem":
              this.invoiceStore.load();
              break;
            case "tblVoucher":
              this.voucherStore.load();
              break;
            case "tblLog":
              this.logStore.load();
              break;
            default:
              break;
          }
        }
      });
    }

    this.ready = true;
  }

  notifyChange(table: keyof Tables | string) {
    this.broadcast?.publish("storage:update", table);
  }

  dispose() {
    this.broadcast?.dispose();
  }
}

export const rootStore = new RootStore();
export default rootStore;
