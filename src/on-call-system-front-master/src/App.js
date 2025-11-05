import logo from './logo.svg';
import './App.scss';
import RoutePage from './components/routes';
import { I18nextProvider } from 'react-i18next';
import i18n from './security/i18n';
import { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
import {AuthProvider} from './components/contexs/AuthProvider';
function App() {
  
  // const navigate = useNavigate()
  useEffect(() => {

    // YourComponent();
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <SnackbarProvider>
        <AuthProvider>
        <RoutePage />
        </AuthProvider>
      </SnackbarProvider>
    </I18nextProvider>
  );
}

export default App;
