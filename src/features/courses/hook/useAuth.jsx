import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const useAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  };
};

export default useAuth;