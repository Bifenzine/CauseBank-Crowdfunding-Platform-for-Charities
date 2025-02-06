import { useEffect, useState } from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
    Box,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Receipt,
    Heart,
    Building2,
    HelpCircle
} from 'lucide-react';
import { useAuthContext } from "../../Context/AuthContext";
import { useStripeContext } from "../../Context/StripeContext";
import CausesSection from "./Sections/CausesSection/CausesSection.jsx";
import OrganizationsSection from "./Sections/OrganizationsSection/OrganizationsSection.jsx";
import DashboardContent from "./Sections/DashboardContent/DashboardContent.jsx";
import TransactionsSection from "./Sections/TransactionsSection/TransactionsSection.jsx";
import SupportSection from "./Sections/SupportSection/SupportSection.jsx";

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 64;
const LEFT_MARGIN = 50;
const TOP_OFFSET = '5rem';

const DashboardOrg = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState('dashboard');

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    const { userOrganisation } = useAuthContext();
    const {
        dashboardData,
        loading,
        error,
        isStripeEnabled,
    } = useStripeContext();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const menuItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { id: 'transactions', text: 'Transactions', icon: <Receipt className="h-5 w-5" /> },
        { id: 'causes', text: 'Causes', icon: <Heart className="h-5 w-5" /> },
        { id: 'organization', text: 'Organization', icon: <Building2 className="h-5 w-5" /> },
        { id: 'support', text: 'Support', icon: <HelpCircle className="h-5 w-5" /> },
    ];

    if (!isStripeEnabled) {
        return (
            <Box className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h4 className="text-2xl font-semibold mb-4">Complete Your Stripe Setup</h4>
                    <p className="text-gray-600">Please complete your Stripe account setup to view your dashboard.</p>
                </div>
            </Box>
        );
    }

    const renderContent = () => {
        switch (selectedTab) {
            case 'transactions':
                return (
                    <div className="p-0">
                        <TransactionsSection dashboardData={dashboardData} userOrganisation={userOrganisation} loading={loading} />
                    </div>
                );
            case 'causes':
                return <CausesSection />;
            case 'organization':
                return <OrganizationsSection />;
            case 'support':
                return <SupportSection />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <Box className="flex min-h-[calc(100vh-8rem)] bg-gray-50 overflow-hidden">
            {!isSmallScreen ? (
                <Drawer
                    variant="permanent"
                    open={open}
                    className="transition-all duration-300 ease-in-out"
                    sx={{
                        width: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
                        flexShrink: 0,
                        position: 'fixed',
                        '& .MuiDrawer-paper': {
                            top: TOP_OFFSET,
                            left: isMobile ? "0rem" : "2rem",
                            height: `calc(100% - ${TOP_OFFSET})`,
                            width: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                            backgroundColor: 'white',
                            overflowX: 'hidden',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        {open && <span className="font-semibold">Menu</span>}
                        <IconButton onClick={handleDrawerToggle} className="ml-auto">
                            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </IconButton>
                    </div>
                    <List className="p-0">
                        {menuItems.map((item) => (
                            <ListItem key={item.id} divider>
                                <ListItemButton
                                    selected={selectedTab === item.id}
                                    onClick={() => {
                                        setSelectedTab(item.id);
                                        if (isMobile) setOpen(false);
                                    }}
                                    className={`
                                        ${selectedTab === item.id ? 'bg-gray-100' : 'hover:bg-gray-50'}
                                        ${!open ? 'justify-center' : ''}
                                    `}
                                >
                                    <div className={open ? "mr-3" : ""}>{item.icon}</div>
                                    {open && <ListItemText primary={item.text} />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            ) : (
                <BottomNavigation
                    showLabels
                    value={selectedTab}
                    onChange={(event, newValue) => {
                        setSelectedTab(newValue);
                    }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg"
                    sx={{
                        width: '100%', // Ensure full width
                        position: 'fixed', // Ensure positioning
                        bottom: 0,
                        left: 0,
                        right: 0,
                        '& .MuiBottomNavigationAction-root': {
                            minWidth: 'auto',
                            maxWidth: 'none', // Remove max-width constraint
                            flex: 1, // Distribute evenly
                            padding: '6px 0', // Reduce padding
                        },
                        '& .MuiBottomNavigationAction-label': {
                            fontSize: '0.675rem', // Slightly smaller font
                        }
                    }}
                >
                    {menuItems.map((item) => (
                        <BottomNavigationAction
                            key={item.id}
                            label={item.text}
                            value={item.id}
                            icon={item.icon}
                        />
                    ))}
                </BottomNavigation>
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: isSmallScreen
                        ? 0
                        : `${open ? DRAWER_WIDTH : isMobile ? 40 : LEFT_MARGIN}px`,
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    padding: 0,
                    width: `calc(100% - ${!isSmallScreen && open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)`,
                    height: `calc(100vh - ${TOP_OFFSET})`,
                    overflowY: 'auto',
                    paddingBottom: isSmallScreen ? '4rem' : 0, // Add bottom padding for bottom nav
                }}
            >
                <div className="p-6">
                    {renderContent()}
                </div>
                {error && (
                    <div className="mt-4 mx-6 p-4 bg-red-50 text-red-500 rounded-lg">
                        {error.message}
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default DashboardOrg;