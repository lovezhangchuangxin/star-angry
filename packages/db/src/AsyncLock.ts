/**
 * 互斥锁
 *
 * @example
 * ```ts
 * const mutex = new Mutex()
 * async function accessSharedResource() {
 *   await mutex.lock()
 *   try {
 *     // 在这里执行需要互斥访问的代码
 *     console.log('Shared resource is being accessed')
 *     await new Promise((resolve) => setTimeout(resolve, 2000))
 *     console.log('Shared resource is being finish')
 *   } finally {
 *     mutex.unlock() // 释放锁
 *   }
 * }
 *
 * accessSharedResource()
 * accessSharedResource()
 */
export class Mutex {
  private locked: boolean = false
  private waiters: Array<() => void> = []

  public lock(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.locked) {
        this.locked = true
        resolve()
      } else {
        this.waiters.push(resolve)
      }
    })
  }

  public unlock(): void {
    if (this.waiters.length > 0) {
      const nextWaiter = this.waiters.shift()
      if (nextWaiter) {
        nextWaiter()
      }
    } else {
      this.locked = false
    }
  }
}

// 使用Mutex锁的例子
// const mutex = new Mutex()
// async function accessSharedResource() {
//   await mutex.lock()
//   try {
//     // 在这里执行需要互斥访问的代码
//     console.log('Shared resource is being accessed')

//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     console.log('Shared resource is being finish')
//   } finally {
//     mutex.unlock() // 释放锁
//   }
// }

// accessSharedResource()
// accessSharedResource()
// accessSharedResource()
// accessSharedResource()
