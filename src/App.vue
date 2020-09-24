<template>
  <div id="app">
  </div>
</template>

<script>

import productPage from '@/services/product'

export default {
  name: 'App',

  data: () => {
    return {
      productPageClass: 'pagina-produto'
    }
  },

  computed: {
    allowedStores: () => process.env.VUE_APP_STORE_IDS
  },

  created () {
    const shopId = window.LOJA_ID || 0

    if (!this.allowedStores.includes(shopId)) {
      console.log('LIE check: NOT OK')
      return
    }
    console.log('LIE check: OK')

    if (document.body.classList.contains(this.productPageClass)) {
      productPage.handle()
    }
  }
}
</script>
