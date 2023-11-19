import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import persistor from './store/store.ts'
import { store } from './store/store.ts'

import { PersistGate } from 'redux-persist/integration/react'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
           {/* <Auth0Provider
               domain="dev-7gtsaiyi367n3bz4.us.auth0.com"
               clientId="K4x1NLCKgoXuoUiZeq13Ehv4Gglnlr03"
               authorizationParams={{
                 redirect_uri: window.location.origin
               }} > */}
              
           <App />
           {/* </Auth0Provider> */}
        </PersistGate>
    </Provider>
)
