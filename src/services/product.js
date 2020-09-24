let sku
let isLie
let lieGroupKey
let lieConfig
let lieGroup

const validations = {
  validateLieProduct: () => {
    sku = window.dataLayer ? window.dataLayer[0].productId : ''
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
      const elBtnBuy = document.getElementsByClassName('botao-comprar')[0]
      const elQtyCart = document.getElementsByClassName('qtde-carrinho')[0]

      function execute ({ min, max }) {
        min = min || 0
        max = max || 100000

        if (min > 0) elQtyCart.value = min

        elQtyCart.addEventListener('change', () => {
          const qtyCart = parseInt(elQtyCart.value)
          if (qtyCart < min || qtyCart > max) {
            elBtnBuy.classList.add('hide')
          } else {
            elBtnBuy.classList.remove('hide')
          }
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
