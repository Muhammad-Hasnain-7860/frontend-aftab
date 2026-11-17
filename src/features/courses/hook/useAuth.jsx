import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const useAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleError = () => {
    const firstError = Object.keys(errors)[0];

    if (firstError) {
      toast.error(errors[firstError].message);
    }
  };

  return {
    register,
    handleSubmit,
    handleError,
    isSubmitting,
  };
};

export default useAuth;