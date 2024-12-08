import React from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { UserData } from '@/types/UserTypes';
import fetchAPI from '@/services/apiServices';

const UsersPage: React.FC = () => {
  const [adminUsers, setAdminUsers] = React.useState<UserData[] | []>([]);

  React.useEffect(() => {
    if (!adminUsers.length) {
      console.log({ adminUsers });

      return;
    }
    const getAllUsers = async () => {
      const users: UserData[] = await fetchAPI('/admin-user');
      setAdminUsers(users || []);
    };

    getAllUsers();
  }, [adminUsers]);

  return <PageWrapper title={'רשימת משתמשים'}></PageWrapper>;
};

export default UsersPage;
