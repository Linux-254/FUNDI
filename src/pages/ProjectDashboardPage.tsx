import React from 'react';
import { ProjectDashboard } from '../components/dashboard/ProjectDashboard';
import { UserRole } from '../types';

interface ProjectDashboardPageProps {
  currency: 'KES' | 'USD';
  currentUserRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
}

export const ProjectDashboardPage: React.FC<ProjectDashboardPageProps> = ({
  currency,
  currentUserRole,
  onSelectRole
}) => {
  return (
    <ProjectDashboard 
      currency={currency} 
      currentUserRole={currentUserRole}
      onSelectRole={onSelectRole} 
    />
  );
};
