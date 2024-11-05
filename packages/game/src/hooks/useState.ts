import { Ref, ref } from 'vue'

export function useState<T>(initValue: T): [typeof state, typeof setState] {
  const state = ref(initValue) as Ref<T>

  const setState = (newValue: typeof initValue) => {
    state.value = newValue
  }

  return [state, setState]
}
