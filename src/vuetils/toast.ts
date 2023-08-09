import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const showSuccessToast = (message: string = "success") => {
    toast.success(message, {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'light',
        hideProgressBar: true,
    })
}

const showErrorToast = (message: string, durationMs: number = 3000) => {
    console.log(durationMs)
    toast.error(message, {
        autoClose: durationMs,
        position: toast.POSITION.TOP_CENTER,
        theme: 'light',
        hideProgressBar: true,
    })
}

export { showSuccessToast, showErrorToast }