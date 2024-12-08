import { SvgIconProps, SxProps, Theme } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

export interface IconWrapperProps extends SvgIconProps {
  type: keyof typeof mapTypeToIcon;
  isDark?: boolean;
  isDisabled?: boolean;
  text?: string;
  textSx?: SxProps<Theme>;
  buttonSx?: SxProps<Theme>;
}

export const mapTypeToIcon: Record<string, React.FC<SvgIconProps>> = {
  add: (props: SvgIconProps) => <AddCircleOutlineOutlinedIcon {...props} />,
  addDoc: (props: SvgIconProps) => <NoteAddIcon {...props} />,
  arrowRight: (props: SvgIconProps) => <EastOutlinedIcon {...props} />,
  arrowLeft: (props: SvgIconProps) => <WestOutlinedIcon {...props} />,
  analytics: (props: SvgIconProps) => <AnalyticsOutlinedIcon {...props} />,
  dashboard: (props: SvgIconProps) => <DashboardIcon {...props} />,
  database: (props: SvgIconProps) => <StorageRoundedIcon {...props} />,
  darkMode: (props: SvgIconProps) => <DarkModeOutlinedIcon {...props} />,
  delete: (props: SvgIconProps) => <DeleteForeverIcon {...props} />,
  doc: (props: SvgIconProps) => <DescriptionIcon {...props} />,
  edit: (props: SvgIconProps) => <EditIcon {...props} />,
  info: (props: SvgIconProps) => <InfoIcon {...props} />,
  products: (props: SvgIconProps) => <Inventory2OutlinedIcon {...props} />,
  search: (props: SvgIconProps) => <SearchOutlinedIcon {...props} />,
  searchDoc: (props: SvgIconProps) => <FindInPageIcon {...props} />,
  lightMode: (props: SvgIconProps) => <LightModeOutlinedIcon {...props} />,
  logout: (props: SvgIconProps) => <LogoutIcon {...props} />,
  login: (props: SvgIconProps) => <LoginIcon {...props} />,
  orders: (props: SvgIconProps) => <ListAltOutlinedIcon {...props} />,
  home: (props: SvgIconProps) => <HomeIcon {...props} />,
  menu: (props: SvgIconProps) => <MenuIcon {...props} />,
  more: (props: SvgIconProps) => <MoreVertIcon {...props} />,
  notification: (props: SvgIconProps) => <NotificationsOutlinedIcon {...props} />,
  users: (props: SvgIconProps) => <PeopleOutlineIcon {...props} />,
  work: (props: SvgIconProps) => <WorkOutlineIcon {...props} />,
};
