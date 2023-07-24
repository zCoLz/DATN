import showUnauthorizedPopup from '../Screens/ErrorAlertLogout';

class UnauthorizedError {
    static checkError(error: { response: { status: any; data: { error_message: any } } }): boolean {
        if (!error.response) {
            return false;
        }
        const {
            status,
            data: { error_message: errorMessage },
        } = error.response;
        let flag = false;
        let content = '';
        if (status === 401) {
            // Thông báo lỗi không có Token
            if (errorMessage === 'Token is not provided') {
                content = 'Không có Token. Xin vui lòng đăng nhập lại!';
                flag = true;
            }
            // Thông báo lỗi Token không hợp lệ
            else if (errorMessage === 'Token is invalid') {
                content = 'Token không hợp lệ. Xin vui lòng đăng nhập lại!';
                flag = true;
            }
            // Thông báo lỗi Token hết hạn
            else if (errorMessage === 'Token is expired') {
                content = 'Phiên này đã hết hạn. Xin vui lòng đăng nhập lại!';
                flag = true;
            }
        } else if (status === 404) {
            if (errorMessage === 'Teacher no exists' || errorMessage === 'Student no exists') {
                content = 'Tài khoản của bạn đã bị xóa.';
                flag = true;
            }
        } else if (status === 403 && errorMessage === 'Access denied') {
            content = 'Bạn không được phép thực hiện truy cập này';
            flag = true;
        }
        if (flag) {
            showUnauthorizedPopup('Lỗi', content);
        }
        return flag;
    }
}

export default UnauthorizedError;
