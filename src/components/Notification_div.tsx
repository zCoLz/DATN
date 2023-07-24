import { notification, Button } from 'antd';
import React from 'react';

const NotificationCustom = (type: 'success' | 'info' | 'warning' | 'error', message: string, description: string) => {
    notification[type]({
        message,
        description,
    });
};

export default NotificationCustom;
