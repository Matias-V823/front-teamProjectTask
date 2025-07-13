import { Link, useLocation, useNavigate } from "react-router";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "@/api/AuthApi";
import { toast } from "react-toastify";
import type { UserConfirmationForm } from "@/types/index";

const ConfirmAccountView = () => {
  const [token, setToken] = useState<UserConfirmationForm['token']>("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlToken = queryParams.get("token");
  const navigate = useNavigate()
  const hasConfirmed = useRef(false);


  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: confirmAccount,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/auth/login')
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  useEffect(() => {
    if (urlToken && !hasConfirmed.current) {
      hasConfirmed.current = true;
      setToken(urlToken);
      mutate({ token: urlToken });
    }
  }, [urlToken, mutate]);

  const handleChange = (value: string) => {
    setToken(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token.length === 6) {
      mutate({ token });
    } else {
      alert("El código debe tener 6 dígitos.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
          Confirma tu Cuenta
        </h1>
        <p className="text-gray-300/90">
          {urlToken ? "Confirmando tu cuenta automáticamente" : "Ingresa el código que recibiste por e-mail."}
        </p>
        {isSuccess && urlToken &&(
          <p className="text-green-400 text-center">Cuenta confirmada con éxito.</p>
        )}
        {isError && urlToken &&(
          <p className="text-red-400 text-center">
            {(error as Error).message || "Hubo un error al confirmar tu cuenta."}
          </p>
        )}
      </div>

      {!urlToken && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl"
        >
          <label className="block text-sm font-medium text-gray-300/80 text-center tracking-wide uppercase">
            Código de 6 dígitos
          </label>

          <div className="flex justify-center">
            <PinInput
              size="lg"
              focusBorderColor="purple.500"
              value={token}
              onChange={handleChange}
              isDisabled={isPending}
            >
              {[...Array(6)].map((_, i) => (
                <PinInputField
                  key={i}
                  className="w-10 h-10 mx-1 text-center bg-gray-700/50 border border-gray-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/80 focus:border-transparent backdrop-blur-sm transition-all duration-150 hover:border-purple-400/30"
                />
              ))}
            </PinInput>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600/90 to-pink-500/90 hover:from-purple-500/90 hover:to-pink-400/90 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 cursor-pointer"
          >
            {isPending ? "Verificando..." : "Verificar Código"}
          </button>

          {isSuccess && (
            <p className="text-green-400 text-center">Cuenta confirmada con éxito.</p>
          )}
          {isError && (
            <p className="text-red-400 text-center">
              {(error as Error).message || "Hubo un error al confirmar tu cuenta."}
            </p>
          )}
        </form>
      )}

      <nav className="mt-6 text-center">
        <Link
          to="/auth/new-code"
          className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 hover:from-purple-300 hover:to-pink-200 font-medium transition-all duration-300"
        >
          Solicitar un nuevo código
        </Link>
      </nav>
    </div>
  );
};

export default ConfirmAccountView;
