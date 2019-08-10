export class Room {
  /**����id */
  // Id: string;
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";

  /**�������� */
  //   RoomName: string;
  get roomName(): string {
    return this.RoomName;
  }
  set roomName(value: string) {
    this.RoomName = value;
  }
  RoomName: string = "";
  /**�ڵ����� */
  //   NodeName: string;
  get nodeName(): string {
    return this.NodeName;
  }
  set nodeName(value: string) {
    this.NodeName = value;
  }
  NodeName: string = "";
  /**�ڵ�id */
  //   NodeID: number;
  get nodeID(): number {
    return this.NodeID;
  }
  set nodeID(value: number) {
    this.NodeID = value;
  }
  NodeID: number = 0;
  /**������� */
  //   RoomCode: string;
  get roomCode(): string {
    return this.RoomCode;
  }
  set roomCode(value: string) {
    this.RoomCode = value;
  }
  RoomCode: string = "";
}
