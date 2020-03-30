/* eslint-disable react-hooks/rules-of-hooks */
// ESLint won't let me survive without this :(

import { Dispatch, SetStateAction, useState, useEffect, useMemo } from 'react'

/**
 * Returns the value of the input key in localStorage. If there is not key found,
 * return null
 *
 * @template TValue - Type of the value got from localStorage
 * @param {Storage} storage
 * @param {string} key
 * @returns { TValue | null }
 */
const getValue = <TValue>(storage: Storage, key: string): TValue | null => {
  try {
    const value = storage.getItem(key)
    return value !== null ? JSON.parse(value) : null
  } catch {
    return null
  }
}
/**
 * Return value from localStorage, otherwise return initialValue
 *
 * @template TValue
 * @param { Storage } storage
 * @param { string } key
 * @param { Tvalue } initialValue
 */
const saveValue = <TValue>(
  storage: Storage,
  key: string,
  initialValue: TValue
): TValue =>
  // Make sure React will render properly.
  useMemo(() => {
    const value = getValue<TValue>(storage, key)
    return value !== null ? value : initialValue
  }, [key, storage, initialValue])

/**
 * Set key-value to localStorage.
 *
 * @template TValue
 * @param { Storage } storage
 * @param { string } key
 * @param { TValue } value
 */
const setValue = async <TValue>(
  storage: Storage,
  key: string,
  value: TValue
): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      storage.setItem(key, JSON.stringify(value))
      resolve()
    } catch (error) {
      reject(error)
    }
  })

/**
 * Handle localStorage setting events
 *
 * @template TValue
 * @param { Storage } storage
 * @param { string } key
 * @param { TValue } value
 */
const handleSetLocalStorage = <TValue>(
  storage: Storage,
  key: string,
  value: TValue
): Error | undefined => {
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    setValue(storage, key, value).catch(setError)
  }, [key, value, storage])

  useEffect(() => {
    setError(undefined)
  }, [key])

  return error
}

/**
 * Handle localStorage changing events.
 * It will update the main function's state to the newest state.
 * So the state will be always correct.
 *
 * @param { string } key
 * @param { Dispatch<SetStateAction<TValue>> } setChange
 */
const handleChangeLocalStorage = <TValue>(
  key: string,
  setChange: Dispatch<SetStateAction<TValue>>
): void => {
  const onChangeLocalStorage = (e: StorageEvent): void => {
    if (e.key === key) {
      setChange((e.newValue !== null ? JSON.parse(e.newValue) : null) as TValue)
    }
  }

  useEffect(() => {
    window.addEventListener('storage', onChangeLocalStorage)

    return (): void => {
      window.removeEventListener('storage', onChangeLocalStorage)
    }
  })
}

/**
 * React custom hook used to handle and manipulate
 * data from local storage.
 *
 * @template TValue - Type parameter passed to hook
 * @param {string} key
 * @param {TValue} initialValue
 * @returns {[TValue, Dispatch<SetStateAction<TValue>>, Error | null]}
 */
const useLocalStorage = <TValue>(
  key: string,
  initialValue: TValue | (() => TValue)
): [TValue, Dispatch<SetStateAction<TValue>>, Error | undefined] => {
  // Support server side rendering
  const storage = typeof localStorage === 'undefined' ? null : localStorage

  // Get inital values stored in local storage,
  // If values didn't exist, get initalValue param.
  const savedValue =
    storage !== null ? saveValue(storage, key, initialValue) : initialValue

  // Get value and set value immediately via SetState method
  const [storageValue, setStorageValue] = useState<TValue>(savedValue)

  // Handle set value from value state,
  // When setValue is triggered, it will update
  // value state and pass to this to handle settings
  const errorFromLocalStorage =
    storage !== null
      ? handleSetLocalStorage<TValue>(storage, key, storageValue)
      : undefined

  handleChangeLocalStorage<TValue>(key, setStorageValue)

  return [storageValue, setStorageValue, errorFromLocalStorage]
}

export default useLocalStorage
