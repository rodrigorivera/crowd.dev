import * as yup from 'yup'
import GenericField from '@/shared/fields/generic-field'
import { i18n } from '@/i18n'
import isInteger from 'lodash/isInteger'

export default class IntegerField extends GenericField {
  constructor(name, label, config = {}) {
    super(name, label)

    this.required = config.required
    this.min = config.min
    this.max = config.max
    this.placeholder = config.placeholder
    this.hint = config.hint
  }

  forPresenter(value) {
    return value
  }

  forFormInitialValue(value) {
    return value
  }

  forFilterInitialValue(value) {
    return value
  }

  forFilterCast() {
    return yup
      .number()
      .integer()
      .nullable(true)
      .label(this.label)
  }

  forFormCast() {
    return yup
      .number()
      .integer()
      .nullable(true)
      .label(this.label)
  }

  forFormRules() {
    const output = []

    const integerFn = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }

      if (isInteger(value)) {
        callback()
        return
      }

      callback(
        new Error(
          i18n('validation.number.integer').replace(
            '${path}',
            this.label
          )
        )
      )
    }

    output.push({
      validator: integerFn
    })

    if (this.required) {
      output.push({
        type: 'number',
        required: Boolean(this.required),
        message: i18n('validation.mixed.required').replace(
          '${path}',
          this.label
        )
      })
    }

    if (this.min || this.min === 0) {
      output.push({
        type: 'number',
        min: this.min,
        message: i18n('validation.number.min')
          .replace('${path}', this.label)
          .replace('${min}', this.min)
      })
    }

    if (this.max || this.max === 0) {
      output.push({
        type: 'number',
        max: this.max,
        message: i18n('validation.number.max')
          .replace('${path}', this.label)
          .replace('${max}', this.max)
      })
    }

    return output
  }

  forExport() {
    return yup.mixed().label(this.label)
  }

  forImport() {
    let yupChain = yup
      .number()
      .integer()
      .nullable(true)
      .label(this.label)

    if (this.required) {
      yupChain = yupChain.required()
    }

    if (this.min || this.min === 0) {
      yupChain = yupChain.min(this.min)
    }

    if (this.max) {
      yupChain = yupChain.max(this.max)
    }

    return yupChain
  }
}
