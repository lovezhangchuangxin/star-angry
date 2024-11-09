export interface MessageModel {
  /**
   * 消息 id
   */
  id: string
  /**
   * 发送者 id
   */
  fromId: string
  /**
   * 消息内容
   */
  content: string
  /**
   * 对方是否可见
   */
  visible: boolean
  /**
   * 自己是否可见
   */
  selfVisible: boolean
  /**
   * 是否已读
   */
  read: boolean
  /**
   * 发送时间
   */
  time: number
}

export interface MessageMap {
  [key: string]: MessageModel[]
}

export type MessageInfo = MessageModel & {
  fromName: string
}
