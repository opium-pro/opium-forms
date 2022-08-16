import {createContext, useContext} from 'react'

export type FormContextValue = {
  setField?: (...args: any) => any
  setFields?: (...args: any) => any
  initialValues?: {[key: string]: any}
  setMatch?: (...args: any) => any
  setInitialValue?: (...args: any) => any
  touched?: boolean
  setTouched?: (...args: any) => any
  reset?: (...args: any) => any
  hasError?: boolean
  setError?: (...args: any) => any
  getFields?: () => any
  getChangedFields?: () => any
  handleSubmit?: (...args: any) => any
  getTouchedFields?: (...args: any) => any
  filled?: boolean
}

export const FormContext = createContext({} as FormContextValue)
export const useForm = () => useContext(FormContext)


export const FieldContext = createContext({} as {
  touched?: boolean
  setTouched?: (...args: any) => any
  hasError?: string | boolean
  setError?: (...args: any) => any
  value?: any
  setValue?: (...args: any) => any
  initialValue?: any
})
export const useField = () => useContext(FieldContext)