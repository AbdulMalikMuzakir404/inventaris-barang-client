import { createStore } from 'vuex'
import auth from './modules/auth'
import item from './modules/item'
import category from './modules/category'

export default createStore({
  modules: {
    auth,
    item,
    category,
  },
})
