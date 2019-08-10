export class IPNet {
  /**主键id */
  // export virtual string Id { get; set; }
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**ip段地址 */
  // export virtual string Net { get; set; }
  get net(): string {
    return this.Net;
  }
  set net(value: string) {
    this.Net = value;
  }
  Net: string = "";
  /**掩码 */
  // export virtual string Mask { get; set; }
  get mask(): string {
    return this.Mask;
  }
  set mask(value: string) {
    this.Mask = value;
  }
  Mask: string = "";
  /**ip段对应的正整数 */
  // export virtual uint NetNum { get; set; }
  get netNum(): number {
    return this.NetNum;
  }
  set netNum(value: number) {
    this.NetNum = value;
  }
  NetNum: number = 0;
  /**掩码长度 */
  // export virtual int MaskLen { get; set; }
  get maskLen(): number {
    return this.MaskLen;
  }
  set maskLen(value: number) {
    this.MaskLen = value;
  }
  MaskLen: number = 0;
  /**ip段下的ip数量 */
  // export virtual uint IPCount { get; set; }
  get iPCount(): number {
    return this.IPCount;
  }
  set iPCount(value: number) {
    this.IPCount = value;
  }
  IPCount: number = 0;
  /**开始ip */
  // export virtual string BeginIp { get; set; }
  get beginIp(): string {
    return this.BeginIp;
  }
  set beginIp(value: string) {
    this.BeginIp = value;
  }
  BeginIp: string = "";
  /**结束ip */
  // export virtual string EndIp { get; set; }
  get endIp(): string {
    return this.EndIp;
  }
  set endIp(value: string) {
    this.EndIp = value;
  }
  EndIp: string = "";
  /**状态 */
  // export virtual int State { get; set; } = 0;
  get state(): number {
    return this.State;
  }
  set state(value: number) {
    this.State = value;
  }
  State: number = 0;
  /**网管地址 */
  // export virtual string Gateway { get; set; }
  get gateway(): string {
    return this.Gateway;
  }
  set gateway(value: string) {
    this.Gateway = value;
  }
  Gateway: string = "";
}
