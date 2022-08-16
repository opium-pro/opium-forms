import React, { useEffect, useRef, useState } from 'react'
import { FormContext, FormContextValue } from './context.js'
import { parseFieldName, mutateObjectForFields, call } from './utils/index.js'
import { config } from './config.js'


type Props = Omit<React.AllHTMLAttributes<HTMLElement>, 'onSubmit'> & {
  onSubmit?: (values: any, context?: FormContextValue) => any
  onChange?: (values: any, context?: FormContextValue) => any
  getContext?: any
  initialValues?: any
  name?: string
}


export function Form({
  children,
  onSubmit,
  onChange,
  getContext,
  name,
  initialValues: defaultInitialValues = {},
  disabled: initialDisabled,
  ...rest
}: Props) {
  const fields = useRef(defaultInitialValues).current
  const touchedFields = useRef({}).current
  const initialValues = useRef({}).current
  const matchValues = useRef({}).current
  const [disabled, setDisabled] = useState(initialDisabled)
  const [touched, setTouched] = useState(false)
  const [hasError, setError] = useState(false)

  function setFields(value, registerChange = true) {
    Object.assign(fields, value)
    registerChange && onChange?.(fields, context)
  }

  function getFields() {
    return fields
  }

  function getTouchedFields() {
    return touchedFields
  }

  useEffect(() => {
    if (initialDisabled !== disabled) {
      setDisabled(initialDisabled)
    }
  }, [initialDisabled])

  function reset() {
    setFields(initialValues)
    for (const key in touchedFields) delete touchedFields[key]
    setTouched(false)
  }

  function setField(name, value, registerChange = true) {
    const newFields = { ...fields }
    const newtouched = { ...touchedFields }
    if (name?.includes?.('.') || name?.includes?.('[')) {
      // Парсим имя, если это не просто одно поле, а вложенные объекты
      mutateObjectForFields(newFields, parseFieldName(name), value)
      registerChange && mutateObjectForFields(newtouched, parseFieldName(name), value)
    } else {
      newFields[name] = value
      registerChange && (newtouched[name] = value)
    }
    registerChange && Object.assign(touchedFields, newtouched)
    setFields(newFields, registerChange)
  }

  function setInitialValue(name, value) {
    if (name?.includes?.('.') || name?.includes?.('[')) {
      // Парсим имя, если это не просто одно поле, а вложенные объекты
      mutateObjectForFields(initialValues, parseFieldName(name), value)
    } else {
      Object.assign(initialValues, { [name]: value })
    }
  }

  function setMatch(name, value) {
    if (name?.includes?.('.') || name?.includes?.('[')) {
      // Парсим имя, если это не просто одно поле, а вложенные объекты
      mutateObjectForFields(matchValues, parseFieldName(name), value)
    } else {
      Object.assign(matchValues, { [name]: value })
    }
  }

  var context: FormContextValue = {
    setField,
    setFields,
    getFields,
    getTouchedFields,
    initialValues,
    setInitialValue,
    touched,
    setTouched,
    reset,
    hasError,
    setError,
    handleSubmit,
    setMatch,
  }

  function match(values = matchValues) {
    let matches = true
    for (const field in values) {
      if (typeof values[field] === 'object') {
        const innerMatch = match(values[field])
        if (!innerMatch) { matches = false }
      } else {
        const error = call(values[field])()
        if (error) { matches = false }
      }
    }
    return matches
  }

  function handleSubmit(e) {
    e?.preventDefault()
    const matched = match()
    matched && onSubmit?.(fields, context)
    return matched
  }

  getContext?.(context)

  let render = typeof children === 'function' ? (children as Function)(context) : children
  if (!config.isNative) {
    render = <form onSubmit={handleSubmit} {...rest}>{render}</form>
  }

  return (
    <FormContext.Provider value={context}>
      {render}
    </FormContext.Provider>
  )
}