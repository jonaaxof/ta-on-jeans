import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PromoPopup from './PromoPopup';

const GlobalPopupManager: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const { userRole } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Validation Logic
        const isAdminPage = location.pathname.startsWith('/admin');
        const isStaff = ['admin', 'moderator', 'owner'].includes(userRole || '');

        // If it's an admin page or user is staff, NEVER show popup
        if (isAdminPage || isStaff) {
            setShowPopup(false);
            return;
        }

        // Otherwise, set timer for regular users on store pages
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 15000); // 15 seconds

        return () => clearTimeout(timer);
    }, [location.pathname, userRole]);

    // Double check render time just in case
    const isAdminPage = location.pathname.startsWith('/admin');
    const isStaff = ['admin', 'moderator', 'owner'].includes(userRole || '');
    if (isAdminPage || isStaff) return null;

    return (
        <PromoPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    );
};

export default GlobalPopupManager;
