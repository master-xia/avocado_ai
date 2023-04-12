import { RouterProvider } from 'react-router-dom'
import { GlobalLoading } from './components/common/GlobalLoading'
import { routes } from './routers'
import CheckAuthTimer from '@components/auth/CheckAuthTimer'

function App() {

  return (
    <>
     

      <RouterProvider router={routes} fallbackElement={<GlobalLoading />} />
    </>
  )
}

export default App
