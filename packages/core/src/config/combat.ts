/**
 * 攻击种类
 */
export enum AttackType {
  /**
   * 炮弹攻击
   */
  Ballistic,
  /**
   * 导弹攻击
   */
  Missile,
  /**
   * 激光攻击
   */
  Laser,
  /**
   * 离子攻击
   */
  Ion,
  /**
   * 等离子攻击
   */
  Plasma,
}

/**
 * 攻击名称
 */
export const AttackTypeName: {
  [key in AttackType]: string
} = {
  [AttackType.Ballistic]: '炮弹攻击',
  [AttackType.Missile]: '导弹攻击',
  [AttackType.Laser]: '激光攻击',
  [AttackType.Ion]: '离子攻击',
  [AttackType.Plasma]: '等离子攻击',
}
