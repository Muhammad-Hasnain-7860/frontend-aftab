import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { router } from './app/router/router.jsx'
import { store } from './app/store/store.js'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { setupInterceptors } from './app/api/axiosInstance.js'


setupInterceptors(store);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
)
