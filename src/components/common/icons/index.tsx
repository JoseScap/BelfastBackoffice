import { IconBaseProps } from 'react-icons';
import { 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaCalendarCheck, 
  FaBed,
  FaHotel,
  FaCalendarAlt,
  FaClipboardList,
  FaUserClock,
  FaSearch,
  FaExclamationCircle
} from 'react-icons/fa';

export const DashboardIcons = {
  CheckIn: (props: IconBaseProps) => <FaSignInAlt {...props} />,
  CheckOut: (props: IconBaseProps) => <FaSignOutAlt {...props} />,
  Calendar: (props: IconBaseProps) => <FaCalendarCheck {...props} />,
  Bed: (props: IconBaseProps) => <FaBed {...props} />,
  Hotel: (props: IconBaseProps) => <FaHotel {...props} />,
  Reservations: (props: IconBaseProps) => <FaCalendarAlt {...props} />,
  List: (props: IconBaseProps) => <FaClipboardList {...props} />,
  Pending: (props: IconBaseProps) => <FaUserClock {...props} />,
  Search: (props: IconBaseProps) => <FaSearch {...props} />,
  Alert: (props: IconBaseProps) => <FaExclamationCircle {...props} />
};

export const IconWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`w-6 h-6 ${className}`}>
    {children}
  </div>
); 