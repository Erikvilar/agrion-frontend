

import Swal from 'sweetalert2';
import type { SweetAlertOptions } from 'sweetalert2';

const styles = {
  base: {
    customClass: {
      popup: 'swal-popup-responsive',
      title: 'swal-title-custom',
      htmlContainer: 'swal-text-custom',
      confirmButton: 'swal-confirm-button-custom',
      cancelButton: 'swal-cancel-button-custom',
    },
  } as SweetAlertOptions,

  confirm: {
    width: '95%',
    imageWidth: 90,
    imageHeight: 90,
    showCancelButton: true,
    confirmButtonColor: '#45e928ff',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, continuar!',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-popup-responsive',
      title: 'swal-title-custom',
      htmlContainer: 'swal-text-custom',
      confirmButton: 'swal-confirm-button-custom',
      cancelButton: 'swal-cancel-button-custom',
    },
  } as SweetAlertOptions,

  success: {
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      popup: 'swal-popup-responsive',
      title: 'swal-title-custom',
      htmlContainer: 'swal-text-custom',
    },
  } as SweetAlertOptions,

  error: {
    icon: 'error',
    customClass: {
      popup: 'swal-popup-responsive',
      title: 'swal-title-custom',
      htmlContainer: 'swal-text-custom',
    },
  } as SweetAlertOptions,
};


export const notificationService = {

    async confirmAction(title = "", text = "") {

        const result = await Swal.fire({
            ...styles.confirm,
            title: title,
            text: text



        });


        return result;
    },

    success(title = "Sucesso!", text = "") {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 1500
        });
    },

    async inputText(title = "Digite algo", placeholder = "Escreva aqui...") {
        const result = await Swal.fire({
            title: title,
            input: 'text',
            inputPlaceholder: placeholder,
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'
        });
        return result
    },

    error(title = "Oops...", text = "Algo deu errado!") {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    },

    showCustomAnimation() {
        Swal.fire({
            title: "Notificação com Animação!",
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            }
        });
    }
};
