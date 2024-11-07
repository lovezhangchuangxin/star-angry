/**
 * 线性同余随机数（伪随机）
 *
 * @param seed 随机种子
 */
export function lcg(seed: number) {
  return function () {
    seed = (1103515245 * seed + 12345) % 0x80000000 // 2^31
    return seed / 0x80000000
  }
}

/**
 * 根据随机数种子和调用次数生成随机数
 *
 * @param seed 随机种子
 * @param count 调用次数
 */
export function random(seed: number, count: number) {
  const g = lcg(seed)
  let result = 0
  for (let i = 0; i < count; i++) {
    result = g()
  }
  return result
}

/**
 * 两个浮点数是否接近
 */
export function isClose(a: number, b: number, epsilon = 1e-6) {
  return Math.abs(a - b) < epsilon
}
