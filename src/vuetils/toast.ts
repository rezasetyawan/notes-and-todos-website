import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const showSuccessToast = (message: string="success") => {
    toast.success(message, {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'light',
        hideProgressBar: true,
    })
}

const showErrorToast = (message: string) => {
    toast.error(message, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'light',
        hideProgressBar: true,
    })
}

export { showSuccessToast, showErrorToast }