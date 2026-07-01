import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await API.put(`/appointments/${id}/payment-success`);

        toast.success("Payment successful");
        navigate("/appointments");
      } catch (error) {
        console.log(error);
        toast.error("Payment verification failed");
        navigate("/appointments");
      }
    };

    verifyPayment();
  }, [id, navigate]);

  return (
    <div className="payment-success-page">
      <h2>Processing your payment...</h2>
    </div>
  );
};

export default PaymentSuccess;
