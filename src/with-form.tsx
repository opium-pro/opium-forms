import React, { useEffect, useState, FC } from 'react'
import { useForm, FieldContext } from './context.js'
import { getDeepFieldByPath } from './utils/index.js'
import { config } from './config.js'
import { match as matchPreset, Match } from './match.js'


export type WithFormProps = {
  value?: any
  initialValue?: any
  name?: string
  match?: [RegExp, string][] | Match
  error?: any
  onBlur?: any
  mask?: any
  disabled?: boolean
  required?: boolean | string
  label?: any
  type?: string
  onChange?: (newValue: any) => any,
  onRender?: (newValue: any) => any,
}

export type WithForm<ComponentProps> = FC<ComponentProps & WithFormProps>

export const withForm = (Component: any) => ({
  onChange = a => a,
  onRender = a => a,
  value,
  initialValue,
  name,
  match,
  error,
  onBlur,
  mask,
  disabled,
  required,
  label,
  type,
  ...rest
}: any) => {
  const [touched, setTouched]: any = useState(false)
  const [hasError, setError]: any = useState(error)
  const {
    setField,
    touched: formTouched,
    setTouched: setFormTouched,
    getFields,
    setInitialValue,
    handleSubmit,
    setMatch,
  } = useForm()
  let fieldValue = (touched && formTouched && name) ? getDeepFieldByPath(name, getFields?.()) : (getFields?.()?.[name] || value || '')
  const [valueState, setValueState]: any = useState(fieldValue)
  setMatch?.(name, matchValue)

  useEffect(() => {
    name && setInitialValue?.(name, initialValue || value)
  }, [])

  useEffect(() => {
    name && setField?.(name, value, false)
    name && setInitialValue?.(name, initialValue || value)
  }, [value])

  function handleBlur(value) {
    if (disabled) { return }
    onBlur?.(value)
    if (touched) {
      matchValue()
    }
  }

  function matchValue() {
    if (!required && !fieldValue) {
      return
    }
    if (match) {
      let errorText = ''
      if (typeof match === 'string') {
        match = matchPreset[match]
      }
      for (const matchItem of match) {
        if (!fieldValue?.match(matchItem[0])) {
          errorText = errorText + ' ' + matchItem[1]
        }
      }
      setError(errorText || false)
      return errorText
    }
    if (required && !fieldValue) {
      const requiredText = required && typeof required === 'string' && required || 'This field is required'
      setError(requiredText)
      return requiredText
    }
  }

  function handleChange(value) {
    !formTouched && setFormTouched?.(true)
    hasError && setError(false)
    !touched && setTouched(true)
    const touchedValue = onChange(value)
    const newValue = touchedValue !== undefined ? touchedValue : value
    name && setField?.(name, newValue)
    setValueState(newValue)
  }

  const props: any = {}

  if (type === 'submit' && config.isNative) {
    props.onPress = () => {
      rest.onPress?.()
      handleSubmit?.()
    }
  }

  if (required && label && typeof label === 'string') {
    label += ' *'
  }

  const context = {
    touched,
    setTouched,
    hasError,
    setError,
    value: fieldValue,
    setValue: handleChange,
    initialValue,
  }

  return (
    <FieldContext.Provider value={context}>
      <Component
        {...rest}
        {...props}
        label={label}
        value={onRender(fieldValue)}
        initialValue={value}
        name={name}
        onChange={!disabled && handleChange}
        onBlur={!disabled && handleBlur}
        error={hasError}
        disabled={disabled}
        type={type}
      />
    </FieldContext.Provider>
  )
}