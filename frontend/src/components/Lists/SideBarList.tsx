import React from 'react';
import { List, ListItem, Accordion, AccordionSummary, AccordionDetails, Typography, SvgIconOwnProps } from '@mui/material';
import { Link } from 'react-router-dom';
import IconWrapper from '../IconWrapper/IconWrapper';
import { FlexRow } from '@/styles/Flex';

const SidebarList: React.FC<{ open: boolean }> = ({ open }) => {
  return (
    <List sx={{ width: '100%' }}>
      {sidebarData.map((header, index) => (
        <Accordion key={index} disableGutters expanded>
          <AccordionSummary>
            <FlexRow flex={1} justifyContent={open ? 'start' : 'center'}>
              <IconWrapper type={header.icon.type} fontSize="large" color={header.icon.color} />
              {open && (
                <Typography variant="h6" color={header.icon.color} sx={{ opacity: 0.5, marginLeft: 1 }}>
                  {header.title}
                </Typography>
              )}
            </FlexRow>
          </AccordionSummary>
          {open && (
            <AccordionDetails>
              <List>
                {header.links.map(({ label, to }, linkIndex) => (
                  <ListItem key={linkIndex} component={Link} to={to}>
                    <Typography variant="subtitle1">{label}</Typography>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          )}
        </Accordion>
      ))}
    </List>
  );
};

export default SidebarList;

interface SidebarData {
  title: string;
  links: { label: string; to: string }[];
  icon: { type: string; color: SvgIconOwnProps['color'] };
}

const sidebarData: SidebarData[] = [
  {
    title: 'מסמכים',
    links: [
      { label: 'תע"מ 24', to: '/dashboard/doc/67548fd90b7ed62e64e30ef1' },
      { label: 'צור  מסמך חדש +', to: '/dashboard/doc/create' },
    ],
    icon: { type: 'doc', color: 'success' },
  },
  {
    title: 'מאגרי מידע',
    links: [
      { label: 'חיילים', to: '/link2-1' },
      { label: 'צור מאגר חדש +', to: '/dashboard/database/create' },
    ],
    icon: { type: 'database', color: 'primary' },
  },
  {
    title: 'משתמשים',
    links: [{ label: 'ניהול משתמשים', to: '/dashboard/users' }],
    icon: { type: 'users', color: 'warning' },
  },
  {
    title: 'אנליטיקה',
    links: [{ label: 'תע"מ 24', to: '/dashboard/analytics/67548fd90b7ed62e64e30ef1' }],
    icon: { type: 'analytics', color: 'secondary' },
  },
];
