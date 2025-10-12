import { validateToken } from '@/api/AuthApi';
import type { validateTokenPassword } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

type newPasswordTokenProps = {
    token: validateTokenPassword['token']
    setToken: React.Dispatch<React.SetStateAction<string>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPasswordToken({ setToken, setIsValidToken }: newPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onSuccess: (data) => {
            toast.success(data.message)
            setIsValidToken(true)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    
    const handleChange = (token: validateTokenPassword['token']) => setToken(token)
    const handleComplete = (token: string) => mutate({token})

    return (
        <div className="max-w-md mx-auto p-6">
            <form
                className="space-y-6 p-8 bg-white backdrop-blur-sm rounded-xl border border-gray-200 shadow-xl"
            >
                <label className="block text-sm font-medium text-gray-700 text-center tracking-wide uppercase">
                    Código de 6 dígitos
                </label>

                <div className="flex justify-center">
                    <PinInput
                        size="lg"
                        focusBorderColor="purple.500"
                        onChange={handleChange}
                        onComplete={handleComplete}
                    >
                        {[...Array(6)].map((_, i) => (
                            <PinInputField
                                key={i}
                                className="w-10 h-10 mx-1 text-center bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500/80 focus:border-transparent backdrop-blur-sm transition-all duration-150 hover:border-purple-400/30"
                            />
                        ))}
                    </PinInput>
                </div>
            </form>

            <nav className="mt-8 text-center">
                <Link
                    to="/auth/forgot-password"
                    className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 font-medium transition-all duration-300"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </div>
    )
}