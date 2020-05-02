export class Customer {
  /**客户id */
  // export virtual string Id { get; set; }
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**客户名称 */
  // export virtual string CustName { get; set; }
  get custName(): string {
    return this.CustName;
  }
  set custName(value: string) {
    this.CustName = value;
  }
  CustName: string = "";
  /**客户编码 */
  // export virtual string CustCode { get; set; }
  get custCode(): string {
    return this.CustCode;
  }
  set custCode(value: string) {
    this.CustCode = value;
  }
  CustCode: string = "";
  /**自动code */
  // export virtual int Code { get; set; }
  get code(): number {
    return this.Code;
  }
  set code(value: number) {
    this.Code = value;
  }
  Code: number = 0;
  /**状态 */
  // export virtual int State { get; set; } = 1;
  get state(): number {
    return this.State;
  }
  set state(value: number) {
    this.State = value;
  }
  State: number = 1;
  /**客户联系人 */
  // export virtual string ContactPerson { get; set; } = "";
  get contactPerson(): string {
    return this.ContactPerson;
  }
  set contactPerson(value: string) {
    this.ContactPerson = value;
  }
  ContactPerson: string = "";
  /**客户联系人电话 */
  // export virtual string ContactPhone { get; set; } = "";
  get contactPhone(): string {
    return this.ContactPhone;
  }
  set contactPhone(value: string) {
    this.ContactPhone = value;
  }
  ContactPhone: string = "";
  /**客户经理 */
  // export virtual string ClientManager { get; set; } = "";
  get clientManager(): string {
    return this.ClientManager;
  }
  set clientManager(value: string) {
    this.ClientManager = value;
  }
  ClientManager: string = "";
  /**客户经理id */
  // export virtual int ClientManagerId { get; set; } = 0;
  get clientManagerId(): number {
    return this.ClientManagerId;
  }
  set clientManagerId(value: number) {
    this.ClientManagerId = value;
  }
  ClientManagerId: number = 0;
  /**客户类型 */
  // export virtual string ClientType { get; set; } = "";
  get clientType(): string {
    return this.ClientType;
  }
  set clientType(value: string) {
    this.ClientType = value;
  }
  ClientType: string = "";
  /**客户类型id */
  // export virtual int ClientTypeId { get; set; } = 999;
  get clientTypeId(): number {
    return this.ClientTypeId;
  }
  set clientTypeId(value: number) {
    this.ClientTypeId = value;
  }
  ClientTypeId: number = 999;
  /**客户节点 */
  // export virtual int NodeId { get; set; } = 20005;
  get nodeId(): number {
    return this.NodeId;
  }
  set nodeId(value: number) {
    this.NodeId = value;
  }
  NodeId: number = 20005;
}
