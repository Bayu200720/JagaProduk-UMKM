import React from 'react';
import { Button } from './Button';

export function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick} className="w-full justify-start">
      Logout
    </Button>
  );
}
