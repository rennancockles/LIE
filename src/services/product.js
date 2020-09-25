let sku
let isLie
let lieGroupKey
let lieConfig
let lieGroup

const validations = {
  validateLieProduct: () => {
    sku = document.querySelector('[itemprop=sku]') ? document.querySelector('[itemprop=sku]').textContent : ''
    isLie = /-lie.*$/i.test(sku)

    if (!isLie) throw new Error('Is not LIE product')

    lieGroupKey = sku.match(/-lie([^-]*)/i)[1]
    lieConfig = window.lieConfig || {}
  },

  validateConfig: () => {
    if (!Object.keys(lieConfig).includes('options')) throw new Error('Missing LIE Configuration: "options"')
    if (!Object.keys(lieConfig).includes('groups')) throw new Error('Missing LIE Configuration: "groups"')
  },

  validateGroups: () => {
    lieGroup = lieConfig.groups[lieGroupKey]

    if (!lieGroup) throw new Error('LIE Group not found: ' + lieGroupKey)
  },

  validateOptions: () => {
    const configOptions = Object.keys(lieConfig.options)

    for (const option of lieGroup) {
      if (!configOptions.includes(option)) throw new Error('LIE Option not found: ' + option)
    }
  }
}

const extensions = {
  validation: {
    cart: () => {
      const elQtyCart = document.getElementsByClassName('qtde-carrinho')

      function execute ({ min, max }) {
        elQtyCart.forEach((el) => {
          if (min && min > 0) {
            el.value = min
            el.min = min
          }

          if (max) el.max = max
        })
      }

      return {
        execute
      }
    }
  },

  create ({ category, type }) {
    return this[category][type]()
  }
}

function validate () {
  try {
    validations.validateLieProduct()
    validations.validateConfig()
    validations.validateGroups()
    validations.validateOptions()

    return true
  } catch {
    return false
  }
}

function handle () {
  validate()

  for (const optionName of lieGroup) {
    const option = lieConfig.options[optionName]
    const ext = extensions.create(option)

    ext.execute(option.parameters)
  }
}

export default {
  handle
}
