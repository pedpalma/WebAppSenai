"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// RF11: notifica o usuário sobre sucesso ou falha de cada operação
export const useNotification = () => {
  function notify(message: string, level: "success" | "error" | "warning" | "info") {
    toast(message, { type: level });
  }
  return { notify };
};

export const NotificationContainer = () => (
  <ToastContainer position="top-right" autoClose={4000} theme="dark" hideProgressBar newestOnTop />
);
