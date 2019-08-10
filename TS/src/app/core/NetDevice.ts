export class NetDevice {
  /**设备的ID */
  // export virtual string Id { get; set; }
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**设备的位置,所在多少U */
  // export virtual string Location { get; set; }
  get location(): string {
    return this.Location;
  }
  set location(value: string) {
    this.Location = value;
  }
  Location: string = "";
  /**设备的高度,占用多少U */
  //   Height: number;
  get height(): number {
    return this.Height;
  }
  set height(value: number) {
    this.Height = value;
  }
  Height: number = 0;
  /**设备名称 */
  //   Name: string;
  get name(): string {
    return this.Name;
  }
  set name(value: string) {
    this.Name = value;
  }
  Name: string = "";
  /**机柜id */
  //   RackId: string;
  get rackId(): string {
    return this.RackId;
  }
  set rackId(value: string) {
    this.RackId = value;
  }
  RackId: string = "";
  /**机柜名称 */
  //   RackName: string;
  get rackName(): string {
    return this.RackName;
  }
  set rackName(value: string) {
    this.RackName = value;
  }
  RackName: string = "";
  //   SysOid: string;
  get sysOid(): string {
    return this.SysOid;
  }
  set sysOid(value: string) {
    this.SysOid = value;
  }
  SysOid: string = "";
  //   SnmpV: number;
  get snmpV(): number {
    return this.SnmpV;
  }
  set snmpV(value: number) {
    this.SnmpV = value;
  }
  SnmpV: number = 0;

  /**网络设备Ip  */
  //   IpAddress: string;
  get ipAddress(): string {
    return this.IpAddress;
  }
  set ipAddress(value: string) {
    this.IpAddress = value;
  }
  IpAddress: string = "";
  //   NodeId: number;
  get nodeId(): number {
    return this.NodeId;
  }
  set nodeId(value: number) {
    this.NodeId = value;
  }
  NodeId: number = 0;

  /**Community */
  //   Community: string;
  get community(): string {
    return this.Community;
  }
  set community(value: string) {
    this.Community = value;
  }
  Community: string = "";
  /**机房名称 */
  //   RoomName: string;
  get roomName(): string {
    return this.RoomName;
  }
  set roomName(value: string) {
    this.RoomName = value;
  }
  RoomName: string = "";
  /**机房id */
  //   RoomId: string;
  get roomId(): string {
    return this.RoomId;
  }
  set roomId(value: string) {
    this.RoomId = value;
  }
  RoomId: string = "";
  /**节点 */
  //   NodeName: string;
  get nodeName(): string {
    return this.NodeName;
  }
  set nodeName(value: string) {
    this.NodeName = value;
  }
  NodeName: string = "";
  /**型号id */
  //   ConfigTreeId: string;
  get configTreeId(): string {
    return this.ConfigTreeId;
  }
  set configTreeId(value: string) {
    this.ConfigTreeId = value;
  }
  ConfigTreeId: string = "";
  /**型号 */
  //   TTName: string;
  get ttName(): string {
    return this.TTName;
  }
  set ttName(value: string) {
    this.TTName = value;
  }
  TTName: string = "";
}
