export class TargetPort {
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**端口使用类型 */
  // export virtual int PortUseState { get; set; }
  get portUseState(): number {
    return this.PortUseState;
  }
  set portUseState(value: number) {
    this.PortUseState = value;
  }
  PortUseState: number = 0;

  // export virtual long PortSpeed { get; set; }
  get portSpeed(): number {
    return this.PortSpeed;
  }
  set portSpeed(value: number) {
    this.PortSpeed = value;
  }
  PortSpeed: number = 0;
  /**端口描述 */
  // export virtual string PortDescr { get; set; }
  get portDescr(): string {
    return this.PortDescr;
  }
  set portDescr(value: string) {
    this.PortDescr = value;
  }
  PortDescr: string = "";
  /**端口名称 */
  // export virtual string PortName { get; set; }
  get portName(): string {
    return this.PortName;
  }
  set portName(value: string) {
    this.PortName = value;
  }
  PortName: string = "";
  /**设备ip */
  // export virtual string TargetIP { get; set; }
  get targetIP(): string {
    return this.TargetIP;
  }
  set targetIP(value: string) {
    this.TargetIP = value;
  }
  TargetIP: string = "";
  /**设备类型 */
  // export virtual string TargetType { get; set; }
  get targetType(): string {
    return this.TargetType;
  }
  set targetType(value: string) {
    this.TargetType = value;
  }
  TargetType: string = "";
  /**设备名称 */
  // export virtual string TargetName { get; set; }
  get targetName(): string {
    return this.TargetName;
  }
  set targetName(value: string) {
    this.TargetName = value;
  }
  TargetName: string = "";
  /**客户名称 */
  // export virtual string CustName { get; set;}
  get custName(): string {
    return this.CustName;
  }
  set custName(value: string) {
    this.CustName = value;
  }
  CustName: string = "";
  /**设备id */
  // export virtual string TargetId { get; set; }
  get targetId(): string {
    return this.TargetId;
  }
  set targetId(value: string) {
    this.TargetId = value;
  }
  TargetId: string = "";
}
