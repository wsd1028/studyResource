export class CustDevice {
  /**设备ID */
  // export virtual int ID { get; set; }
  get id(): number {
    return this.ID;
  }
  set id(value: number) {
    this.ID = value;
  }
  ID: number = 0;
  /**设备编码 */
  // export virtual string ServerCode { get; set; }
  get serverCode(): string {
    return this.ServerCode;
  }
  set serverCode(value: string) {
    this.ServerCode = value;
  }
  ServerCode: string = "";
  /**设备名称 */
  // export virtual string ServerName { get; set; }
  get serverName(): string {
    return this.ServerName;
  }
  set serverName(value: string) {
    this.ServerName = value;
  }
  ServerName: string = "";
  /**设备规格（占几个U位） */
  // export virtual int FacStandard { get; set; }
  get facStandard(): number {
    return this.FacStandard;
  }
  set facStandard(value: number) {
    this.FacStandard = value;
  }
  FacStandard: number = 0;
  /**操作系统ID */
  // export virtual int OSID { get; set; }
  get oSID(): number {
    return this.OSID;
  }
  set oSID(value: number) {
    this.OSID = value;
  }
  OSID: number = 0;
  /**操作系统名称 */
  // export virtual string OSName { get; set; }
  get oSName(): string {
    return this.OSName;
  }
  set oSName(value: string) {
    this.OSName = value;
  }
  OSName: string = "";
  /**技术指标 */
  // export virtual string TechInfo { get; set; }
  get techInfo(): string {
    return this.TechInfo;
  }
  set techInfo(value: string) {
    this.TechInfo = value;
  }
  TechInfo: string = "";
  /**私有IP */
  // export virtual string PrivateIP { get; set; }
  get privateIP(): string {
    return this.PrivateIP;
  }
  set privateIP(value: string) {
    this.PrivateIP = value;
  }
  PrivateIP: string = "";
  /**外网IP */
  // export virtual string PublicIP { get; set; }
  get publicIP(): string {
    return this.PublicIP;
  }
  set publicIP(value: string) {
    this.PublicIP = value;
  }
  PublicIP: string = "";
  /**设备所在机柜ID */
  // export virtual int CabId { get; set; }
  get cabId(): string {
    return this.CabId;
  }
  set cabId(value: string) {
    this.CabId = value;
  }
  CabId: string = "";
  /**设备所在机柜编码 */
  // export virtual string CabName { get; set; }
  get cabName(): string {
    return this.CabName;
  }
  set cabName(value: string) {
    this.CabName = value;
  }
  CabName: string = "";
  /**客户ID */
  // export virtual int UserId { get; set; }
  get userId(): number {
    return this.UserId;
  }
  set userId(value: number) {
    this.UserId = value;
  }
  UserId: number = 0;
  /**客户名称 */
  // export virtual string UserName { get; set; }
  get userName(): string {
    return this.UserName;
  }
  set userName(value: string) {
    this.UserName = value;
  }
  UserName: string = "";
  /**设备状态，-1：新增；2：删除；3：修改；4：正常；都是指工单未走完时该设备的状态，如果工单走完，则该删除的就会真删除，修改和新增的则会变为正常 */
  // export virtual int State { get; set; }
  get state(): number {
    return this.State;
  }
  set state(value: number) {
    this.State = value;
  }
  State: number = 0;
  /**上联ip */
  // export virtual string LinkIP { get; set; }
  get linkIP(): string {
    return this.LinkIP;
  }
  set linkIP(value: string) {
    this.LinkIP = value;
  }
  LinkIP: string = "";
  /**上联端口 */
  // export virtual string LinkPort { get; set; }
  get linkPort(): string {
    return this.LinkPort;
  }
  set linkPort(value: string) {
    this.LinkPort = value;
  }
  LinkPort: string = "";
  /**上联设备id */
  // export virtual string LinkTargetId { get; set; }
  get linkTargetId(): string {
    return this.LinkTargetId;
  }
  set linkTargetId(value: string) {
    this.LinkTargetId = value;
  }
  LinkTargetId: string = "";
  /**上联端口id */
  // export virtual string LinkPortId { get; set; }
  get linkPortId(): string {
    return this.LinkPortId;
  }
  set linkPortId(value: string) {
    this.LinkPortId = value;
  }
  LinkPortId: string = "";
  /**设备所在机房名称 */
  // export virtual string RoomName { get; set; }
  get roomName(): string {
    return this.RoomName;
  }
  set roomName(value: string) {
    this.RoomName = value;
  }
  RoomName: string = "";
  /**机房id */
  // export virtual string RoomId { get; set; }
  get roomId(): string {
    return this.RoomId;
  }
  set roomId(value: string) {
    this.RoomId = value;
  }
  RoomId: string = "";
  /**节点id */
  // export virtual int NodeId { get; set; }
  get nodeId(): number {
    return this.NodeId;
  }
  set nodeId(value: number) {
    this.NodeId = value;
  }
  NodeId: number = 0;
  /**节点名称 */
  // export virtual string NodeName { get; set; }
  get nodeName(): string {
    return this.NodeName;
  }
  set nodeName(value: string) {
    this.NodeName = value;
  }
  NodeName: string = "";
  /**设备的位置,所在多少U */
  // export virtual string Location { get; set; }
  get location(): string {
    return this.Location;
  }
  set location(value: string) {
    this.Location = value;
  }
  Location: string = "";
  /**设备机位 */
  // export virtual List<Useat> Useats { get; set; }
}
