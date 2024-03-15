import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';

// Import necessary icons and components
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import { Avatar, Badge, Tooltip } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth'; // Import your authentication hook
import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const auth = useAuth(); // Use your authentication hook to access user information
  const router = useRouter();
  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
      router.push('/auth/login');
    },
    [onClose, auth]
  );
  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 1 }}>
          <Box sx={{ p: 1 }}>
            <img
              src="https://dev.tcgsync.com/logo_tcg_sync_colored.webp"
              alt="TCG Sync Logo"
              style={{ width: '240px' }}
            />
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />

        {/* Display user information and logout button */}
        {auth.isAuthenticated && (
          <Box sx={{ px: 2, pb: 2 }}>
            
            <Typography variant="body2" sx={{ mt: 1 }}>
             Logged in as <strong>{auth.user.username}</strong>
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleSignOut} // Call your logout function here
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};
