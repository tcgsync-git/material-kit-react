import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import ClipboardDocumentCheck from '@heroicons/react/24/solid/ClipboardDocumentCheckIcon';
import InboxStack from '@heroicons/react/24/solid/InboxStackIcon';
import BankNotesIcon from '@heroicons/react/24/solid/BankNotesIcon';
import { SvgIcon } from '@mui/material';
import { AdfScannerRounded, AllInclusiveOutlined, CalendarViewWeekRounded, FreeBreakfastOutlined, ShoppingBasketRounded, WarehouseOutlined, WarehouseRounded } from '@mui/icons-material';
import { FaStore, FaShopify } from "react-icons/fa";
import { MdOutlinePointOfSale } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { MdPriceChange } from "react-icons/md";
import { FaSync } from "react-icons/fa";
export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Buylist',
    path: '/buylist/orders',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBasketRounded />
      </SvgIcon>
    )
  },
  {
    title: 'Card Scanning',
    path: '/scanning',
    icon: (
      <SvgIcon fontSize="small">
        <AdfScannerRounded />
      </SvgIcon>
    )
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <BsPeopleFill  />
      </SvgIcon>
    )
  },
  {
    title: 'Ebay',
    path: '/ebay',
    icon: (
      <SvgIcon fontSize="small">
        <FaStore  />
      </SvgIcon>
    )
  },
  {
    title: 'Event Module',
    path: '/events',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarViewWeekRounded />
      </SvgIcon>
    )
  },
  {
    title: 'Free Tools',
    path: '/tools/catalogue',
    icon: (
      <SvgIcon fontSize="small">
        <AllInclusiveOutlined />
      </SvgIcon>
    )
  },
  {
    title: 'Inventory',
    path: '/inventory/view',
    icon: (
      <SvgIcon fontSize="small">
        <InboxStack />
      </SvgIcon>
    )
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentCheck />
      </SvgIcon>
    )
  },
  {
    title: 'POS',
    path: '/pos',
    icon: (
      <SvgIcon fontSize="small">
        <MdOutlinePointOfSale   />
      </SvgIcon>
    )
  },
  {
    title: 'Pricing',
    path: '/pricing/overview',
    icon: (
      <SvgIcon fontSize="small">
        <MdPriceChange   />
      </SvgIcon>
    )
  },
  {
    title: 'Shopify',
    path: '/shopify',
    icon: (
      <SvgIcon fontSize="small">
        <FaShopify />
      </SvgIcon>
    )
  },
  {
    title: 'Syncing',
    path: '/syncing',
    icon: (
      <SvgIcon fontSize="small">
        <FaSync />
      </SvgIcon>
    )
  },
  {
    title: 'Warehouse',
    path: '/warehouse',
    icon: (
      <SvgIcon fontSize="small">
        <WarehouseRounded />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  }
];

