export class IP {
  /**ip本身的id */
  // export virtual string Id { get; set; }
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**客户id */
  // export virtual string CustId { get; set; }
  get custId(): string {
    return this.CustId;
  }
  set custId(value: string) {
    this.CustId = value;
  }
  CustId: string = "";
  /**ip所属客户 */
  // export virtual string CustName { get; set; }
  get custName(): string {
    return this.CustName;
  }
  set custName(value: string) {
    this.CustName = value;
  }
  CustName: string = "";
  /**ip地址对应的正整数 */
  // export virtual uint IpNumber { get; set; }
  get ipNumber(): number {
    return this.IpNumber;
  }
  set ipNumber(value: number) {
    this.IpNumber = value;
  }
  IpNumber: number = 0;
  /**ip地址字符串 */
  // export virtual string IpAddress { get; set; }
  get ipAddress(): string {
    return this.IpAddress;
  }
  set ipAddress(value: string) {
    this.IpAddress = value;
  }
  IpAddress: string = "";
  /**掩码 */
  // export virtual string Mask { get; set; }
  get mask(): string {
    return this.Mask;
  }
  set mask(value: string) {
    this.Mask = value;
  }
  Mask: string = "";
  /**状态 */
  // export virtual int State { get; set; } = 1;
  get state(): number {
    return this.State;
  }
  set state(value: number) {
    this.State = value;
  }
  State: number = 1;
  /**ip段 */
  // export virtual string Net { get; set; }
  get net(): string {
    return this.Net;
  }
  set net(value: string) {
    this.Net = value;
  }
  Net: string = "";

}
