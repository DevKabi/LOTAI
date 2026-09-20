import React, { useState } from 'react';
import { AuthView } from '../../types/auth';
import { LandingPage } from '../landing/LandingPage';
import { LoginPage } from './LoginPage';
import { SignUpPage } from './SignUpPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';

export const AuthFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | AuthView>('landing');

  switch (currentView) {
    case 'signup':
      return <SignUpPage onSwitchView={(v) => setCurrentView(v)} />;
    case 'forgot_password':
      return <ForgotPasswordPage onSwitchView={(v) => setCurrentView(v)} />;
    case 'login':
      return <LoginPage onSwitchView={(v) => setCurrentView(v)} />;
    case 'landing':
    default:
      return <LandingPage />;
  }
};
