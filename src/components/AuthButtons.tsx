import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

const AuthButtons: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <SignInButton mode="modal">
        <button className="px-4 py-2 text-sm font-medium text-[#003057] bg-white border border-[#003057] rounded-md hover:bg-blue-50 transition-colors">Sign In</button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="px-4 py-2 text-sm font-medium text-white bg-[#003057] rounded-md hover:opacity-90 transition-opacity shadow-sm">Sign Up</button>
      </SignUpButton>
    </div>
  );
};

export default AuthButtons;