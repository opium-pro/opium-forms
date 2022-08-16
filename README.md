# opium-forms
Form controller for both React Native and React Dom

## 1. Install the package
```
npm i opium-forms
```

## 2. Wrap your dummy component with `withForm` HOC
```jsx
import { withForm } from 'opium-forms'

const MyInput = withForm(() => 'Your code here')
```

This will add following props to the component:

* `value` — value of the component. Will be changed automatically
* `initialValue` — this value will be used to reset the form. If not specified, `value` will be used to reset
* `name` — Required `string`. Name of the value in the output object. You can use string (`user`) or object-like strings (`user.email`, 'user.accounts[0]') to describe the structure of the object
* `match` — regexp to compare value with. Has to be an array of arrays like this: `[[/[0-9]/, 'Use only digits'], [[0-9]{4}, 'Use exectly 4 digits']]`. If one of the regexps doesn't match, an error will be set to the field
* `error` — string`. If you want to set an error manually, use this prop
* `disabled` — `boolean`
* `required` — `boolean`
* `type` — `string`. If type is `submit`, the form will be fully checked after clicking on this component
* `onRender` — Function like: `(value) => modifiedvalue`. Receives a value and changes it. Doesn't affect the output object with all the values, affects only the appearence of value on render

## 3. Wrap your input with `Form` component
```jsx
import { Form } from 'opium-forms'
import { MyInput } from 'opium-forms'

function handleForm(values) {
  console.log(values)
  // Logs { name: 'name value', user: { accont: 'some deep user account value' } }
}

const App = () => <Form onChange={handleForm} onSubmit={handleForm}>
  <MyInput name="name">
  <MyInput name="user.accont">
  <MyInput type="submit">
</Form>
```

## 4. Using Form Hook
Inside the `Form` component you can use `useForm` hook
```jsx
import { useForm } from 'opium-forms'

const App = () => <Form>
  <Fields />
</Form>

const Fields = () => {
  const {
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
  } = useForm()
}
```